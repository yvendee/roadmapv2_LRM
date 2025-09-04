<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyTractionAnnualPriority extends Model
{
    protected $table = 'company_traction_annual_priorities';

    protected $fillable = [
        'u_id',
        'organizationName',
        'annualPrioritiesData',
        'statusFlag',
    ];

    protected $casts = [
        'annualPrioritiesData' => 'array',
    ];
}
