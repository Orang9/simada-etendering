<?php

namespace App\Http\Controllers;

use App\Models\PaketPengadaan;
use App\Models\Penawaran;
use App\Models\EvaluasiPenawaran;
use App\Models\PemenangTender;
use App\Models\Pengguna;
use Illuminate\Http\Request;

class DashboardController extends Controller
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

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if (in_array($role, ['Admin', 'Pokja'])) {
            return response()->json([
                'role' => $role,
                'total_paket' => PaketPengadaan::count(),
                'paket_open' => PaketPengadaan::where('status', 'open')->count(),
                'paket_close' => PaketPengadaan::where('status', 'close')->count(),
                'total_penawaran' => Penawaran::count(),
                'total_evaluasi' => EvaluasiPenawaran::count(),
                'total_pemenang' => PemenangTender::count(),
                'total_penyedia' => Pengguna::whereHas('role', function ($query) {
                    $query->where('nama_role', 'Penyedia');
                })->count(),
            ]);
        }

        if ($role === 'Penyedia') {
            return response()->json([
                'role' => $role,
                'total_penawaran_saya' => Penawaran::where('pengguna_id', $user->pengguna_id)->count(),
                'penawaran_lolos' => EvaluasiPenawaran::whereHas('penawaran', function ($query) use ($user) {
                    $query->where('pengguna_id', $user->pengguna_id);
                })->where('status_evaluasi', 'Lolos')->count(),
                'penawaran_tidak_lolos' => EvaluasiPenawaran::whereHas('penawaran', function ($query) use ($user) {
                    $query->where('pengguna_id', $user->pengguna_id);
                })->where('status_evaluasi', 'Tidak Lolos')->count(),
                'total_menang' => PemenangTender::where('pengguna_id', $user->pengguna_id)->count(),
                'paket_open' => PaketPengadaan::where('status', 'open')->count(),
            ]);
        }

        if ($role === 'Masyarakat') {
            return response()->json([
                'role' => $role,
                'paket_open' => PaketPengadaan::where('status', 'open')->count(),
                'paket_close' => PaketPengadaan::where('status', 'close')->count(),
                'total_pemenang_diumumkan' => PemenangTender::count(),
            ]);
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }
}