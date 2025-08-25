<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthUser extends Model
{
    protected $table = 'auth';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'u_id',
        'firstName',
        'lastName',
        'email',
        'organization',
        'passwordHash',
        'role',
        'group',
        'position',
        'status',
        'resetCode',
        'expireAt',
        'token',
        'accessToken',
        'refreshToken',
    ];

    protected $casts = [
        'expireAt' => 'datetime',
    ];
}
