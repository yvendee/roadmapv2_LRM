<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flywheel extends Model
{
    use HasFactory;

    protected $table = 'flywheel';

    protected $fillable = [
        'u_id',
        'organizationName',
        'fileLink',
        'statusFlag',
    ];
}
