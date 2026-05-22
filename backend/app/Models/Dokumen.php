<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    protected $table = 'dokumen';
    protected $primaryKey = 'dokumen_id';
    protected $fillable = [
        'paket_id',
        'nama_file',
        'jenis_dokumen',
        'tanggal_upload',
    ];

    public function paketPengadaan()
{
    return $this->belongsTo(PaketPengadaan::class, 'paket_id', 'paket_id');
} 
}
