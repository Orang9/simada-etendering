<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenggunaPaketPengadaan extends Model
{
    protected $table = 'penggunapaketpengadaan';
    protected $primaryKey = 'id_pengguna_paket';

    protected $fillable = [
        'pengguna_id',
        'paket_id',
        'peran_dalam_paket',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id', 'pengguna_id');
    }

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }
}