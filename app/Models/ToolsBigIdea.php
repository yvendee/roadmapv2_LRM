<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolsBigIdea extends Model
{
    protected $table = 'tools_big_ideas';

    protected $fillable = [
        'u_id',
        'organizationName',
        'toolsBigIdeasData',
        'statusFlag',
    ];

    protected $casts = [
        'toolsBigIdeasData' => 'array',
    ];
}
