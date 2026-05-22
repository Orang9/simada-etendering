<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anggaran extends Model
{
    protected $table = 'anggaran';
    protected $primaryKey = 'anggaran_id';

    protected $fillable = [
        'paket_id',
        'nilai',
        'tahun',
    ];

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }
}