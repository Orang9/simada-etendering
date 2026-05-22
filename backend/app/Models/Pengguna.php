<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengguna extends Authenticatable
{
    protected $table = 'pengguna';
    protected $primaryKey = 'pengguna_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role_id',
        'remember_token',
    ];

    // Relationships
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function paketPengguna(): HasMany
    {
        return $this->hasMany(PenggunaPaketPengadaan::class, 'pengguna_id', 'pengguna_id');
    }

    public function penawaran(): HasMany
    {
        return $this->hasMany(Penawaran::class, 'pengguna_id', 'pengguna_id');
    }

    public function evaluasiPenawaran(): HasMany
    {
        return $this->hasMany(EvaluasiPenawaran::class, 'pengguna_id', 'pengguna_id');
    }

    public function pemenangTender(): HasMany
    {
        return $this->hasMany(PemenangTender::class, 'pengguna_id', 'pengguna_id');
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class, 'pengguna_id', 'pengguna_id');
    }
}
