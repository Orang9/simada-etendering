<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create(['nama_role' => 'Admin']);
        Role::create(['nama_role' => 'Pokja']);
        Role::create(['nama_role' => 'Penyedia']);
        Role::create(['nama_role' => 'Masyarakat']);
    }
}
