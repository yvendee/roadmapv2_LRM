<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolsVictory extends Model
{
    protected $table = 'tools_victories';

    protected $fillable = [
        'u_id',
        'organizationName',
        'toolsVictoriesData',
        'statusFlag',
    ];

    protected $casts = [
        'toolsVictoriesData' => 'array',
    ];
}
