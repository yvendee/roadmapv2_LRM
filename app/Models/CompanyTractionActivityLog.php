<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyTractionActivityLog extends Model
{
    protected $table = 'company_traction_activity_logs';

    protected $fillable = [
        'u_id',
        'organizationName',
        'companyTractionActivityLogsData',
        'statusFlag',
    ];

    protected $casts = [
        'companyTractionActivityLogsData' => 'array',
    ];
}
