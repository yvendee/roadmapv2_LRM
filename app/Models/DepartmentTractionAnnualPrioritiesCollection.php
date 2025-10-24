<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentTractionAnnualPrioritiesCollection extends Model
{
    protected $table = 'department_traction_annual_priorities_collection';

    protected $fillable = [
        'u_id',
        'organizationName',
        'tag',
        'departmentTractionData',
        'statusFlag',
    ];

    protected $casts = [
        'departmentTractionData' => 'array',
    ];
}
