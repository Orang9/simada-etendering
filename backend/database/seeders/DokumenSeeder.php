<?php

namespace Database\Seeders;

use App\Models\Dokumen;
use App\Models\PaketPengadaan;
use Illuminate\Database\Seeder;

class DokumenSeeder extends Seeder
{
    public function run(): void
    {
        $paket1 = PaketPengadaan::first();

        if (!$paket1) {
            return;
        }

        Dokumen::create([
            'paket_id' => $paket1->paket_id,
            'nama_file' => 'dokumen_tender_001.pdf',
            'jenis_dokumen' => 'Dokumen Tender',
            'tanggal_upload' => now()->toDateString(),
        ]);

        $paket2 = PaketPengadaan::skip(1)->first();

        if ($paket2) {
            Dokumen::create([
                'paket_id' => $paket2->paket_id,
                'nama_file' => 'dokumen_tender_002.pdf',
                'jenis_dokumen' => 'Dokumen Tender',
                'tanggal_upload' => now()->toDateString(),
            ]);
        }
    }
}