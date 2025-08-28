<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspStrategicDriver extends Model
{
    protected $table = 'opsp_strategic_drivers';

    protected $fillable = [
        'u_id',
        'organizationName',
        'strategicDriversData',
        'statusFlag',
    ];

    protected $casts = [
        'strategicDriversData' => 'array',
    ];
}
