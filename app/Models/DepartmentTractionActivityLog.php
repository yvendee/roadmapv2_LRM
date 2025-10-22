<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentTractionActivityLog extends Model
{
    protected $table = 'department_traction_activity_logs';

    protected $fillable = [
        'u_id',
        'organizationName',
        'departmentTractionActivityLogsData',
        'statusFlag',
    ];

    protected $casts = [
        'departmentTractionActivityLogsData' => 'array',
    ];
}
