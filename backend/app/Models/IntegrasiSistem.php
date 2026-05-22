<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IntegrasiSistem extends Model
{
    protected $table = 'integrasisistem';
    protected $primaryKey = 'integrasi_id';

    protected $fillable = [
        'paket_id',
        'sistem_eksternal_id',
        'jenis_integrasi',
        'waktu_integrasi',
    ];

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }

    public function sistemEksternal()
    {
        return $this->belongsTo(SistemEksternal::class, 'sistem_eksternal_id', 'sistem_eksternal_id');
    }
}