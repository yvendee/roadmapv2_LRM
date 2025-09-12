<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachingAlignmentCoachingGoal extends Model
{
    protected $table = 'coaching_alignment_coaching_goals';

    protected $fillable = [
        'u_id',
        'organizationName',
        'coachingAlignmentCoachingGoalsData',
        'statusFlag',
    ];

    protected $casts = [
        'coachingAlignmentCoachingGoalsData' => 'array',
    ];
}
