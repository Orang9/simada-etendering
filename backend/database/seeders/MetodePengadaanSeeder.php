<?php

namespace Database\Seeders;

use App\Models\MetodePengadaan;
use Illuminate\Database\Seeder;

class MetodePengadaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            ['nama_metode' => 'e-Tendering'],
            ['nama_metode' => 'e-Pengadaan Langsung'],
            ['nama_metode' => 'e-Purchasing'],
        ];
        foreach ($methods as $data) {
            MetodePengadaan::firstOrCreate($data);
        }
    }
}
