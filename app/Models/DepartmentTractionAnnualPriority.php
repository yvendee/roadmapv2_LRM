<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentTractionAnnualPriority extends Model
{
    protected $table = 'department_traction_annual_priorities';

    protected $fillable = [
        'u_id',
        'organizationName',
        'annualPrioritiesData',
        'statusFlag',
    ];

    protected $casts = [
        'annualPrioritiesData' => 'array', // Auto-cast JSON to array
    ];
}
