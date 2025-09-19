<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'u_id',
        'userName',
        'notificationsData',
        'statusFlag',
    ];

    protected $casts = [
        'notificationsData' => 'array',
    ];
}
