<?php

namespace Database\Seeders;

use App\Models\PemenangTender;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PemenangTenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paket1 = PemenangTender::first();

        if (!$paket1) {
            return;
        }

        PemenangTender::create([
            'paket_id' => $paket1->paket_id,
            'penawaran_id' => $paket1->penawaran_id,
            'pengguna_id' => $paket1->pengguna_id,
            'tanggal_penetapan' => now()->toDateString(),
            'nilai_final' => 1000000,
            'status_pemenang' => 'menang',
            'catatan_penetapan' => 'Dummy pemenang tender record',
        ]);
    }
}
