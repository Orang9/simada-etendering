<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PaketPengadaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                // Ensure there is at least one OPD and MetodePengadaan
        $opd = \App\Models\OPD::first();
        $metode = \App\Models\MetodePengadaan::where('nama_metode', 'e-Tendering')->first();
        if (! $opd || ! $metode) {
            return; // cannot create paket without dependencies
        }

        $paketData = [
            ['nama_paket' => 'Paket A', 'status' => 'Open', 'opd_id' => $opd->opd_id, 'metode_id' => $metode->metode_id],
            ['nama_paket' => 'Paket B', 'status' => 'Open', 'opd_id' => $opd->opd_id, 'metode_id' => $metode->metode_id],
            ['nama_paket' => 'Paket C', 'status' => 'Closed', 'opd_id' => $opd->opd_id, 'metode_id' => $metode->metode_id],
        ];
        foreach ($paketData as $data) {
            \App\Models\PaketPengadaan::firstOrCreate($data);
        }
    }
}
