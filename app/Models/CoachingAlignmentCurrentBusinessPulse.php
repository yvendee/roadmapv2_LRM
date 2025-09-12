<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachingAlignmentCurrentBusinessPulse extends Model
{
    protected $table = 'coaching_alignment_current_business_pulse';

    protected $fillable = [
        'u_id',
        'organizationName',
        'coachingAlignmentCurrentBusinessPulseData',
        'statusFlag',
    ];

    protected $casts = [
        'coachingAlignmentCurrentBusinessPulseData' => 'array',
    ];
}
