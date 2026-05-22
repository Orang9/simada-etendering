<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Masyarakat extends Model
{
    protected $table = 'masyarakat';
    protected $primaryKey = 'masyarakat_id';

    protected $fillable = [
        'nama',
        'email',
    ];

    public function aksesInformasi()
    {
        return $this->hasMany(AksesInformasi::class, 'masyarakat_id', 'masyarakat_id');
    }
}