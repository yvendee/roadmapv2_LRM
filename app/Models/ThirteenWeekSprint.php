<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThirteenWeekSprint extends Model
{
    use HasFactory;

    protected $table = 'thirteen_week_sprint';

    protected $fillable = [
        'u_id',
        'organizationName',
        'thirteenWeekSprintData',
        'statusFlag',
    ];

    protected $casts = [
        'thirteenWeekSprintData' => 'array',
    ];
}
