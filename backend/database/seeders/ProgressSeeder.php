<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed one progress entry for the first paket
        $paket = \App\Models\PaketPengadaan::first();
        if (! $paket) {
            return;
        }
        \App\Models\Progress::create([
            'paket_id'        => $paket->paket_id,
            'tanggal'         => now()->toDateString(),
            'status_progress' => 'In Progress',
            'keterangan'      => 'Initial progress entry',
        ]);
    }
}
