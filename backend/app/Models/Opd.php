<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OPD extends Model
{
    protected $table = 'opd';
    protected $primaryKey = 'opd_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'nama_opd',
    ];

    public function paketPengadaan()
    {
        return $this->hasMany(PaketPengadaan::class, 'opd_id', 'opd_id');
    }
}
