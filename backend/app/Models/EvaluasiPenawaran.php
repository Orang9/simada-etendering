<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluasiPenawaran extends Model
{
    protected $table = 'evaluasipenawaran';
    protected $primaryKey = 'evaluasi_id';

    protected $fillable = [
        'penawaran_id',
        'pengguna_id',
        'status_evaluasi',
        'nilai_teknis',
        'nilai_harga',
        'total_nilai',
        'catatan_evaluasi',
        'tanggal_evaluasi',
    ];

    public function penawaran()
    {
        return $this->belongsTo(Penawaran::class, 'penawaran_id', 'penawaran_id');
    }

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id', 'pengguna_id');
    }
}