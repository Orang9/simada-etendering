<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opd extends Model
{
    protected $fillable = [
        'name',
    ];

    public function paketPengadaans()
    {
        return $this->hasMany(PaketPengadaan::class, 'opd_id');
    }
}
?>
