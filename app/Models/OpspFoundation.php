<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspFoundation extends Model
{
    protected $table = 'opsp_foundations';

    protected $fillable = [
        'u_id',
        'organizationName',
        'foundationsData',
        'statusFlag',
    ];

    protected $casts = [
        'foundationsData' => 'array',
    ];
}
