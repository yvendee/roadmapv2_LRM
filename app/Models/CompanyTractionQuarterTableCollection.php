<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyTractionQuarterTableCollection extends Model
{
    protected $table = 'company_traction_quarter_table_collection';

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
