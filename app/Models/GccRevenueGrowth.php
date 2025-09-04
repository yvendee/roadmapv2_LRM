<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GccRevenueGrowth extends Model
{
    protected $table = 'gcc_financial_growth';

    protected $fillable = [
        'u_id',
        'organizationName',
        'financialGrowthData',
        'statusFlag',
    ];

    protected $casts = [
        'financialGrowthData' => 'array',
    ];
}
