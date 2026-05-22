<?php

namespace App\Http\Controllers;

use App\Models\Penawaran;
use App\Models\PaketPengadaan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PenawaranController extends Controller
{
    /**
     * List penawaran.
     * Admin & Pokja see all; Penyedia see own.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = optional($user->role)->nama_role;

        if (in_array($role, ['Admin', 'Pokja'])) {
            $penawarans = Penawaran::all();
        } else {
            $penawarans = Penawaran::where('pengguna_id', $user->pengguna_id)->get();
        }

        return response()->json($penawarans);
    }

    /**
     * Show a single penawaran.
     */
    public function show($penawaran_id, Request $request): JsonResponse
    {
        $penawaran = Penawaran::find($penawaran_id);
        if (! $penawaran) {
            return response()->json(['error' => 'Penawaran not found'], 404);
        }

        $user = $request->user();
        $role = optional($user->role)->nama_role;
        if (in_array($role, ['Admin', 'Pokja']) || $penawaran->pengguna_id == $user->pengguna_id) {
            return response()->json($penawaran);
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    /**
     * Penyedia submit a new penawaran for a published paket.
     */
    public function store($paket_id, Request $request): JsonResponse
    {
        $user = $request->user();

        // Verify paket exists and is published
        $paket = PaketPengadaan::where('paket_id', $paket_id)
            ->where('status', 'open')
            ->first();
        if (! $paket) {
            return response()->json(['error' => 'Paket not found or not open'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nomor_penawaran'   => 'required|string|max:255',
            'nilai_penawaran'   => 'required|numeric',
            'tanggal_penawaran' => 'date',
            'status_penawaran'  => 'string',
            'catatan'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['paket_id'] = $paket->paket_id;
        $data['pengguna_id'] = $user->pengguna_id;
        $data['tanggal_penawaran'] = $data['tanggal_penawaran'] ?? Carbon::now()->toDateString();
        $data['status_penawaran'] = $data['status_penawaran'] ?? 'Submitted';

        $penawaran = Penawaran::create($data);
        return response()->json($penawaran, 201);
    }
}
