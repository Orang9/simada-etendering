<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AksesInformasi extends Model
{
    protected $table = 'aksesinformasi';
    protected $primaryKey = 'akses_id';

    protected $fillable = [
        'masyarakat_id',
        'paket_id',
        'waktu_akses',
    ];

    public function masyarakat()
    {
        return $this->belongsTo(Masyarakat::class, 'masyarakat_id', 'masyarakat_id');
    }

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }
}