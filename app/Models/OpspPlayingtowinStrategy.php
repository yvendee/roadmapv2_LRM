<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspPlayingtowinStrategy extends Model
{
    protected $table = 'opsp_playingtowin_strategy';

    protected $fillable = [
        'u_id',
        'organizationName',
        'playingToWinStrategyData',
        'statusFlag',
    ];

    protected $casts = [
        'playingToWinStrategyData' => 'array', // automatically cast JSON to array
    ];
}
