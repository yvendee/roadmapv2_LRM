<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionDatesMonthlySessionsTracker extends Model
{
    protected $table = 'session_dates_monthly_sessions_tracker';

    protected $fillable = [
        'u_id',
        'organizationName',
        'sessionDatesMonthlySessionsTrackerData',
        'statusFlag',
    ];

    protected $casts = [
        'sessionDatesMonthlySessionsTrackerData' => 'array',
    ];
}
