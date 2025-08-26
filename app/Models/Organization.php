<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Organization extends Model
{
    protected $table = 'organizations';

    protected $fillable = [
        'u_id',
        'organizationName',
        'industry',
        'size',
        'location',
        'token',
        'status',
        'owner',
    ];

    public static function boot()
    {
        parent::boot();

        // Automatically generate UUID when creating
        static::creating(function ($model) {
            $model->u_id = (string) Str::uuid();
        });
    }
}
