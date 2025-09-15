<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolsIssue extends Model
{
    protected $table = 'tools_issues';

    protected $fillable = [
        'u_id',
        'organizationName',
        'toolsIssuesData',
        'statusFlag',
    ];

    protected $casts = [
        'toolsIssuesData' => 'array',
    ];
}
