<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentTractionQuarterTableCollection extends Model
{
    protected $table = 'department_traction_quarter_table_collection';

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
