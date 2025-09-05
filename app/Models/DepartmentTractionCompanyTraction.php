<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentTractionCompanyTraction extends Model
{
    protected $table = 'department_traction_company_traction_table';

    protected $fillable = [
        'u_id',
        'organizationName',
        'companyTractionData',
        'statusFlag',
    ];

    protected $casts = [
        'companyTractionData' => 'array',
    ];
}
