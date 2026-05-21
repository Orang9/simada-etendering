<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role_id',
    ];

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function paketPengadaans()
    {
        return $this->belongsToMany(PaketPengadaan::class, 'pengguna_paket_pengadaan');
    }

    public function notifikasis()
    {
        return $this->hasMany(Notifikasi::class, 'user_id');
    }

    public function penawarans()
    {
        return $this->hasMany(Penawaran::class, 'user_id');
    }

    public function evaluasiPenawarans()
    {
        return $this->hasMany(EvaluasiPenawaran::class, 'user_id');
    }

    public function pemenangTenders()
    {
        return $this->hasMany(PemenangTender::class, 'user_id');
    }
}
?>
