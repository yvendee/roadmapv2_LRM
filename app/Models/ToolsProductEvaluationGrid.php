<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolsProductEvaluationGrid extends Model
{
    protected $table = 'tools_product_evaluation_grids';

    protected $fillable = [
        'u_id',
        'organizationName',
        'toolsProductEvaluationGridsData',
        'statusFlag',
    ];

    protected $casts = [
        'toolsProductEvaluationGridsData' => 'array',
    ];
}
