<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembersDepartment extends Model
{
    use HasFactory;

    protected $table = 'members_departments';

    protected $fillable = [
        'u_id',
        'organizationName',
        'membersDepartmentsData',
        'statusFlag',
    ];

    protected $casts = [
        'membersDepartmentsData' => 'array', // Laravel handles JSON casting
    ];
}
