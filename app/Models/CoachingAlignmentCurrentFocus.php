<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachingAlignmentCurrentFocus extends Model
{
    protected $table = 'coaching_alignment_current_focus';

    protected $fillable = [
        'u_id',
        'organizationName',
        'coachingAlignmentCurrentFocusData',
        'statusFlag',
    ];

    protected $casts = [
        'coachingAlignmentCurrentFocusData' => 'array',
    ];
}
