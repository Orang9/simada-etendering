<?php

namespace Database\Seeders;

use App\Models\Pengguna;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        // Retrieve roles
        $adminRole = Role::where('nama_role', 'Admin')->first();
        $pokjaRole = Role::where('nama_role', 'Pokja')->first();
        $providerRole = Role::where('nama_role', 'Penyedia')->first();
        $publicRole = Role::where('nama_role', 'Masyarakat')->first();

        // Admin user
        Pengguna::create([
            'nama' => 'Admin Pengguna',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->role_id,
        ]);

        // Pokja user
        Pengguna::create([
            'nama' => 'Pokja Pengguna',
            'email' => 'pokja@example.com',
            'password' => Hash::make('password'),
            'role_id' => $pokjaRole->role_id,
        ]);

        // Penyedia One
        Pengguna::create([
            'nama' => 'Penyedia One',
            'email' => 'penyedia1@example.com',
            'password' => Hash::make('password'),
            'role_id' => $providerRole->role_id,
        ]);

        // Penyedia Two
        Pengguna::create([
            'nama' => 'Penyedia Two',
            'email' => 'penyedia2@example.com',
            'password' => Hash::make('password'),
            'role_id' => $providerRole->role_id,
        ]);

        // Masyarakat user
        Pengguna::create([
            'nama' => 'Masyarakat Pengguna',
            'email' => 'masyarakat@example.com',
            'password' => Hash::make('password'),
            'role_id' => $publicRole->role_id,
        ]);
    }
}
