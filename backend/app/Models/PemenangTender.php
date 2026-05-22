<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PemenangTender extends Model
{
    protected $table = 'pemenangtender';
    protected $primaryKey = 'pemenang_id';

    protected $fillable = [
        'paket_id',
        'penawaran_id',
        'pengguna_id',
        'tanggal_penetapan',
        'nilai_final',
        'status_pemenang',
        'catatan_penetapan',
    ];

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }

    public function penawaran()
    {
        return $this->belongsTo(Penawaran::class, 'penawaran_id', 'penawaran_id');
    }

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id', 'pengguna_id');
    }
}