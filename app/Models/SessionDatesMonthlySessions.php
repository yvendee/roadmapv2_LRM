<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionDatesMonthlySessions extends Model
{
    protected $table = 'session_dates_monthly_sessions';

    protected $fillable = [
        'u_id',
        'organizationName',
        'sessionDatesMonthlySessionsData',
        'statusFlag',
    ];

    protected $casts = [
        'sessionDatesMonthlySessionsData' => 'array', // Auto-cast to array from JSON
    ];
}
