<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachingAlignmentWhatsNext extends Model
{
    protected $table = 'coaching_alignment_whats_next';

    protected $fillable = [
        'u_id',
        'organizationName',
        'coachingAlignmentWhatsNextData',
        'statusFlag',
    ];

    protected $casts = [
        'coachingAlignmentWhatsNextData' => 'array',
    ];
}
