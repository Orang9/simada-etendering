<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaketPengadaan extends Model
{
    protected $table = 'paketpengadaan';
    protected $primaryKey = 'paket_id';

    protected $fillable = [
        'nama_paket',
        'status',
        'opd_id',
        'metode_id',
    ];

    public function opd()
    {
        return $this->belongsTo(OPD::class, 'opd_id', 'opd_id');
    }

    public function metodePengadaan()
    {
        return $this->belongsTo(MetodePengadaan::class, 'metode_id', 'metode_id');
    }

    public function anggaran()
    {
        return $this->hasOne(Anggaran::class, 'paket_id', 'paket_id');
    }

    public function dokumen()
    {
        return $this->hasMany(Dokumen::class, 'paket_id', 'paket_id');
    }

    public function progress()
    {
        return $this->hasMany(Progress::class, 'paket_id', 'paket_id');
    }

    public function penawaran()
    {
        return $this->hasMany(Penawaran::class, 'paket_id', 'paket_id');
    }

    public function pemenangTender()
    {
        return $this->hasOne(PemenangTender::class, 'paket_id', 'paket_id');
    }

    public function integrasiSistem()
    {
        return $this->hasMany(IntegrasiSistem::class, 'paket_id', 'paket_id');
    }

    public function aksesInformasi()
    {
        return $this->hasMany(AksesInformasi::class, 'paket_id', 'paket_id');
    }

    public function penggunaPaketPengadaan()
    {
        return $this->hasMany(PenggunaPaketPengadaan::class, 'paket_id', 'paket_id');
    }
}