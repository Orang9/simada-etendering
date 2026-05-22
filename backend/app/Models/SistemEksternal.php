<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SistemEksternal extends Model
{
    protected $table = 'sistemeksternal';
    protected $primaryKey = 'sistem_eksternal_id';

    protected $fillable = [
        'nama_sistem',
    ];

    public function integrasiSistem()
    {
        return $this->hasMany(IntegrasiSistem::class, 'sistem_eksternal_id', 'sistem_eksternal_id');
    }
}