<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoreboardProjectProgressCard extends Model
{
    protected $table = 'scoreboard_project_progress_card';

    protected $fillable = [
        'u_id',
        'organizationName',
        'projectProgressCardData',
        'statusFlag',
    ];

    protected $casts = [
        'projectProgressCardData' => 'array',
    ];
}
