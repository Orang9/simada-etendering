<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EvaluasiPenawaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find a penawaran and an admin/pokja user
        $penawaran = \App\Models\Penawaran::first();
        $admin = \App\Models\Pengguna::whereHas('role', function ($q) {
            $q->where('nama_role', 'Admin');
        })->first();
        if (! $penawaran || ! $admin) {
            return; // cannot seed without dependencies
        }

        \App\Models\EvaluasiPenawaran::create([
            'penawaran_id'   => $penawaran->penawaran_id,
            'pengguna_id'    => $admin->pengguna_id,
            'status_evaluasi'=> 'Lulus',
            'nilai_teknis'   => 4.5,
            'nilai_harga'    => 4.5,
            'total_nilai'    => 9.0,
            'catatan_evaluasi'=> 'Evaluasi lengkap',
            'tanggal_evaluasi'=> now()->toDateString(),
        ]);
    }
}
