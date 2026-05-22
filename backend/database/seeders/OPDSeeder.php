<?php

namespace Database\Seeders;

use App\Models\Opd;
use Illuminate\Database\Seeder;

class OPDSeeder extends Seeder
{
    public function run(): void
    {
        Opd::create(['nama_opd' => 'OPD A']);
        Opd::create(['nama_opd' => 'OPD B']);
    }
}
