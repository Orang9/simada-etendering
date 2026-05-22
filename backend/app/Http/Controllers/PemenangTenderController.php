<?php

namespace App\Http\Controllers;

use App\Models\PemenangTender;
use App\Models\EvaluasiPenawaran;
use App\Models\Penawaran;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PemenangTenderController extends Controller
{
    private function getUser(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $user = Pengguna::find($request->bearerToken());
        }

        return $user;
    }

    public function index(Request $request)
    {
        $user = $this->getUser($request);
        $role = optional($user?->role)->nama_role;

        if (in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(
                PemenangTender::with(['paketPengadaan', 'penawaran', 'pengguna'])->get()
            );
        }

        if ($role === 'Penyedia') {
            return response()->json(
                PemenangTender::with(['paketPengadaan', 'penawaran', 'pengguna'])
                    ->where('pengguna_id', $user->pengguna_id)
                    ->get()
            );
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    public function show(Request $request, $id)
    {
        $user = $this->getUser($request);
        $role = optional($user?->role)->nama_role;

        $pemenang = PemenangTender::with(['paketPengadaan', 'penawaran', 'pengguna'])
            ->where('pemenang_id', $id)
            ->first();

        if (!$pemenang) {
            return response()->json(['error' => 'Pemenang tender not found'], 404);
        }

        if (in_array($role, ['Admin', 'Pokja'])) {
            return response()->json($pemenang);
        }

        if ($role === 'Penyedia' && $pemenang->pengguna_id == $user->pengguna_id) {
            return response()->json($pemenang);
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    public function store(Request $request)
    {
        $user = $this->getUser($request);
        if (!$user && $request->bearerToken()) {
            $user = \App\Models\Pengguna::find($request->bearerToken());
        }

        $role = optional($user?->role)->nama_role;

        if (!in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'paket_id' => 'required|exists:paketpengadaan,paket_id',
            'penawaran_id' => 'required|exists:penawaran,penawaran_id',
            'nilai_final' => 'required|numeric',
            'status_pemenang' => 'required|string|max:50',
            'catatan_penetapan' => 'nullable|string',
            'tanggal_penetapan' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $penawaran = Penawaran::where('penawaran_id', $request->penawaran_id)->first();

        if (!$penawaran) {
            return response()->json(['error' => 'Penawaran not found'], 404);
        }

        if ($penawaran->paket_id != $request->paket_id) {
            return response()->json(['error' => 'Penawaran does not belong to this paket'], 422);
        }

        $evaluasi = EvaluasiPenawaran::where('penawaran_id', $request->penawaran_id)->first();

        if (!$evaluasi) {
            return response()->json(['error' => 'Penawaran has not been evaluated'], 422);
        }

        if ($evaluasi->status_evaluasi !== 'Lolos') {
            return response()->json(['error' => 'Only penawaran with Lolos evaluation can be selected as winner'], 422);
        }

        $existingWinner = PemenangTender::where('paket_id', $request->paket_id)->first();

        if ($existingWinner) {
            return response()->json(['error' => 'This paket already has a winner'], 409);
        }

        $pemenang = PemenangTender::create([
            'paket_id' => $request->paket_id,
            'penawaran_id' => $request->penawaran_id,
            'pengguna_id' => $penawaran->pengguna_id,
            'tanggal_penetapan' => $request->tanggal_penetapan ?? now()->toDateString(),
            'nilai_final' => $request->nilai_final,
            'status_pemenang' => $request->status_pemenang,
            'catatan_penetapan' => $request->catatan_penetapan,
        ]);

        return response()->json($pemenang, 201);
    }
}