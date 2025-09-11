<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachingChecklistPanel extends Model
{
    protected $table = 'coaching_checklist_panels';

    protected $fillable = [
        'u_id',
        'organizationName',
        'coachingChecklistPanelsData',
        'statusFlag',
    ];

    protected $casts = [
        'coachingChecklistPanelsData' => 'array',
    ];
}
