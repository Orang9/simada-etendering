<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';
    protected $primaryKey = 'role_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;
    protected $fillable = [
        'nama_role',
    ];

    public function pengguna()
    {
    return $this->hasMany(Pengguna::class, 'role_id', 'role_id');
    }
}
