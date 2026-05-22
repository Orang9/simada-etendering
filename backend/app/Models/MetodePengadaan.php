<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodePengadaan extends Model
{
    protected $table = 'metodepengadaan';
    protected $fillable = [
        'nama_metode',
    ];
}
