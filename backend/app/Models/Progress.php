<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    protected $table = 'progress';
    protected $primaryKey = 'progress_id';

    protected $fillable = [
        'paket_id',
        'tanggal',
        'status_progress',
        'keterangan',
    ];

    public function paketPengadaan()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
    }
}