<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembersDirectory extends Model
{
    use HasFactory;

    protected $table = 'members_directory';

    protected $fillable = [
        'u_id',
        'organizationName',
        'membersDirectoryData',
        'statusFlag',
    ];

    protected $casts = [
        'membersDirectoryData' => 'array', // auto-cast JSON to array
    ];
}
