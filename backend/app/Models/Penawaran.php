<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penawaran extends Model
{
    protected $table = 'penawaran';
    protected $primaryKey = 'penawaran_id';

    protected $fillable = [
        'paket_id',
        'pengguna_id',
        'nomor_penawaran',
        'nilai_penawaran',
        'tanggal_penawaran',
        'status_penawaran',
        'catatan',
    ];

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id', 'pengguna_id');
    }

    public function evaluasiPenawaran()
    {
        return $this->hasOne(EvaluasiPenawaran::class, 'penawaran_id', 'penawaran_id');
    }

    public function pemenangTender()
    {
        return $this->hasOne(PemenangTender::class, 'penawaran_id', 'penawaran_id');
    }
}