<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyTractionAnnualPrioritiesCollection extends Model
{
    protected $table = 'company_traction_annual_priorities_collection';

    protected $fillable = [
        'u_id',
        'organizationName',
        'tag',
        'companyTractionData',
        'statusFlag',
    ];

    protected $casts = [
        'companyTractionData' => 'array',
    ];
}
