<?php

namespace App\Http\Controllers;

use App\Models\PaketPengadaan;
use App\Models\Penawaran;
use App\Models\EvaluasiPenawaran;
use App\Models\PemenangTender;
use App\Models\Pengguna;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    private function getUser(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $user = Pengguna::find($request->bearerToken());
        }

        return $user;
    }

    public function paket(Request $request)
    {
        $user = $this->getUser($request);
        $role = optional($user?->role)->nama_role;

        if (!in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json([
            'title' => 'Laporan Paket Pengadaan',
            'data' => PaketPengadaan::with(['opd', 'metodePengadaan', 'anggaran'])->get()
        ]);
    }

    public function penawaran(Request $request)
    {
        $user = $this->getUser($request);
        $role = optional($user?->role)->nama_role;

        if (!in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json([
            'title' => 'Laporan Penawaran',
            'data' => Penawaran::with(['paketPengadaan', 'pengguna', 'evaluasiPenawaran'])->get()
        ]);
    }

    public function evaluasi(Request $request)
    {
        $user = $this->getUser($request);
        $role = optional($user?->role)->nama_role;

        if (!in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json([
            'title' => 'Laporan Evaluasi Penawaran',
            'data' => EvaluasiPenawaran::with(['penawaran', 'pengguna'])->get()
        ]);
    }

    public function pemenang(Request $request)
    {
        $user = $this->getUser($request);
        $role = optional($user?->role)->nama_role;

        if (in_array($role, ['Admin', 'Pokja'])) {
            $data = PemenangTender::with(['paketPengadaan', 'penawaran', 'pengguna'])->get();
        } elseif ($role === 'Penyedia') {
            $data = PemenangTender::with(['paketPengadaan', 'penawaran', 'pengguna'])
                ->where('pengguna_id', $user->pengguna_id)
                ->get();
        } else {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json([
            'title' => 'Laporan Pemenang Tender',
            'data' => $data
        ]);
    }
}