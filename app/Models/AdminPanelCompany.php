<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminPanelCompany extends Model
{
    use HasFactory;

    protected $table = 'admin_panel_companies';

    protected $fillable = [
        'u_id',
        'organizationName',
        'companiesData',
        'statusFlag',
    ];

    protected $casts = [
        'companiesData' => 'array',
    ];
}
