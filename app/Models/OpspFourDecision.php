<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspFourDecision extends Model
{
    protected $table = 'opsp_fourDecisions';

    protected $fillable = [
        'u_id',
        'organizationName',
        'fourDecisionsData',
        'statusFlag',
    ];

    protected $casts = [
        'fourDecisionsData' => 'array',
    ];
}
