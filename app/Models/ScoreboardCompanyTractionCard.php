<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoreboardCompanyTractionCard extends Model
{
    protected $table = 'scoreboard_company_traction_card';

    protected $fillable = [
        'u_id',
        'organizationName',
        'companyTractionCardData',
        'statusFlag',
    ];

    protected $casts = [
        'companyTractionCardData' => 'array',
    ];
}
