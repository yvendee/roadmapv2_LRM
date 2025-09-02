<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspConstraintsTracker extends Model
{
    protected $table = 'opsp_constraints_tracker';

    protected $fillable = [
        'u_id',
        'organizationName',
        'constraintsTrackerData',
        'statusFlag',
    ];

    protected $casts = [
        'constraintsTrackerData' => 'array',
    ];
}
