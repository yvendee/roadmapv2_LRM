<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocumentVault extends Model
{
    use HasFactory;

    protected $table = 'document_vault';

    protected $fillable = [
        'u_id',
        'organizationName',
        'documentVaultData',
        'statusFlag',
    ];

    protected $casts = [
        'documentVaultData' => 'array',
    ];
}
