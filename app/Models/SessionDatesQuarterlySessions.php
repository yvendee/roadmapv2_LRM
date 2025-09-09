<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionDatesQuarterlySessions extends Model
{
    use HasFactory;

    protected $table = 'session_dates_quarterly_sessions';

    protected $fillable = [
        'u_id',
        'organizationName',
        'sessionDatesQuarterlySessionsData',
        'statusFlag',
    ];

    protected $casts = [
        'sessionDatesQuarterlySessionsData' => 'array',
    ];
}
