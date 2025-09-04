<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GccMetric extends Model
{
    use HasFactory;

    protected $table = 'gcc_metrics';

    protected $fillable = [
        'u_id',
        'organizationName',
        'metricsData',
        'statusFlag',
    ];

    protected $casts = [
        'metricsData' => 'array',  // Automatically cast JSON to array and vice versa
    ];
}
