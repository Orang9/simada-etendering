<?php

namespace Database\Seeders;

use App\Models\Anggaran;
use App\Models\PaketPengadaan;
use Illuminate\Database\Seeder;

class AnggaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure there is at least one PaketPengadaan
        $paket = PaketPengadaan::first();
        if (! $paket) {
            return; // No paket to attach anggaran
        }

        Anggaran::create([
            'paket_id' => $paket->paket_id,
            'nilai'    => 1000000.,
            'tahun'    => date('Y'),
        ]);
    }
}
