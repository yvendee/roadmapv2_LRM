<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessagingMessage extends Model
{
    protected $table = 'messaging_messages';

    protected $fillable = [
        'u_id',
        'fullName',
        'messagesData',
        'statusFlag',
    ];

    protected $casts = [
        'messagesData' => 'array', // This makes sure messagesData is cast as an array or JSON
    ];
}
