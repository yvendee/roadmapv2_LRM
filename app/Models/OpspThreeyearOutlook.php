<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspThreeyearOutlook extends Model
{
    protected $table = 'opsp_threeyear_outlook';

    protected $fillable = [
        'u_id',
        'organizationName',
        'threeyearOutlookData',
        'statusFlag',
    ];

    protected $casts = [
        'threeyearOutlookData' => 'array',
    ];
}

