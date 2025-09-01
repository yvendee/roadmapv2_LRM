<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspCoreCapability extends Model
{
    protected $table = 'opsp_core_capabilities';

    protected $fillable = [
        'u_id',
        'organizationName',
        'coreCapabilitiesData',
        'statusFlag',
    ];

    protected $casts = [
        'coreCapabilitiesData' => 'array',
    ];
}
