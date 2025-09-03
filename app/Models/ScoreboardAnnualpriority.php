<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoreboardAnnualpriority extends Model
{
    protected $table = 'scoreboard_annualpriorities';

    protected $fillable = [
        'u_id',
        'organizationName',
        'annualPrioritiesdData',
        'statusFlag',
    ];

    protected $casts = [
        'annualPrioritiesdData' => 'array',
    ];
}
