<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationAssociation extends Model
{
    protected $table = 'organization_association';

    protected $fillable = [
        'u_id',
        'email',
        'organizationList',
        'statusFlag',
    ];

    protected $casts = [
        'organizationList' => 'array', // automatically handle JSON as array
    ];
}
