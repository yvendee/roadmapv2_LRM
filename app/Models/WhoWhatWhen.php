<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhoWhatWhen extends Model
{
    protected $table = 'who_what_when';

    protected $fillable = [
        'u_id',
        'organizationName',
        'whoWhatWhenData',
        'statusFlag',
    ];

    protected $casts = [
        'whoWhatWhenData' => 'array', // auto-cast JSON to array
    ];
}
