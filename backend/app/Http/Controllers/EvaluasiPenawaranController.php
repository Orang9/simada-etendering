<?php

namespace App\Http\Controllers;

use App\Models\EvaluasiPenawaran;
use App\Models\Penawaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EvaluasiPenawaranController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $user = \App\Models\Pengguna::find($request->bearerToken());
        }

        $role = optional($user?->role)->nama_role;

        if (in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(EvaluasiPenawaran::with(['penawaran', 'pengguna'])->get());
        }

        if ($role === 'Penyedia') {
            return response()->json(
                EvaluasiPenawaran::whereHas('penawaran', function ($query) use ($user) {
                    $query->where('pengguna_id', $user->pengguna_id);
                })->with(['penawaran', 'pengguna'])->get()
            );
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $user = \App\Models\Pengguna::find($request->bearerToken());
        }

        $role = optional($user?->role)->nama_role;

        $evaluasi = EvaluasiPenawaran::with(['penawaran', 'pengguna'])
            ->where('evaluasi_id', $id)
            ->first();

        if (!$evaluasi) {
            return response()->json(['error' => 'Evaluasi not found'], 404);
        }

        if (in_array($role, ['Admin', 'Pokja'])) {
            return response()->json($evaluasi);
        }

        if ($role === 'Penyedia' && $evaluasi->penawaran->pengguna_id == $user->pengguna_id) {
            return response()->json($evaluasi);
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $user = \App\Models\Pengguna::find($request->bearerToken());
        }

        $role = optional($user?->role)->nama_role;

        if (!in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'penawaran_id' => 'required|exists:penawaran,penawaran_id',
            'status_evaluasi' => 'required|in:Evaluasi,Lolos,Tidak Lolos',
            'nilai_teknis' => 'required|numeric|min:0|max:100',
            'nilai_harga' => 'required|numeric|min:0|max:100',
            'catatan_evaluasi' => 'nullable|string',
            'tanggal_evaluasi' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existing = EvaluasiPenawaran::where('penawaran_id', $request->penawaran_id)->first();

        if ($existing) {
            return response()->json(['error' => 'Penawaran already evaluated'], 409);
        }

        $total = ($request->nilai_teknis + $request->nilai_harga) / 2;

        $evaluasi = EvaluasiPenawaran::create([
            'penawaran_id' => $request->penawaran_id,
            'pengguna_id' => $user->pengguna_id,
            'status_evaluasi' => $request->status_evaluasi,
            'nilai_teknis' => $request->nilai_teknis,
            'nilai_harga' => $request->nilai_harga,
            'total_nilai' => $total,
            'catatan_evaluasi' => $request->catatan_evaluasi,
            'tanggal_evaluasi' => $request->tanggal_evaluasi ?? now()->toDateString(),
        ]);

        return response()->json($evaluasi, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $user = \App\Models\Pengguna::find($request->bearerToken());
        }

        $role = optional($user?->role)->nama_role;

        if (!in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $evaluasi = EvaluasiPenawaran::where('evaluasi_id', $id)->first();

        if (!$evaluasi) {
            return response()->json(['error' => 'Evaluasi not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_evaluasi' => 'sometimes|in:Evaluasi,Lolos,Tidak Lolos',
            'nilai_teknis' => 'sometimes|numeric|min:0|max:100',
            'nilai_harga' => 'sometimes|numeric|min:0|max:100',
            'catatan_evaluasi' => 'nullable|string',
            'tanggal_evaluasi' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $evaluasi->fill($validator->validated());

        if ($request->has('nilai_teknis') || $request->has('nilai_harga')) {
            $nilaiTeknis = $request->nilai_teknis ?? $evaluasi->nilai_teknis;
            $nilaiHarga = $request->nilai_harga ?? $evaluasi->nilai_harga;
            $evaluasi->total_nilai = ($nilaiTeknis + $nilaiHarga) / 2;
        }

        $evaluasi->save();

        return response()->json($evaluasi);
    }
}