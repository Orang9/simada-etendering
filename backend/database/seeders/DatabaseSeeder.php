<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PenggunaSeeder::class,
            OPDSeeder::class,
            MetodePengadaanSeeder::class,
            PaketPengadaanSeeder::class,
            AnggaranSeeder::class,
            DokumenSeeder::class,
            ProgressSeeder::class,
            PenawaranSeeder::class,
            EvaluasiPenawaranSeeder::class,
            PemenangTenderSeeder::class,
        ]);
    }
}
