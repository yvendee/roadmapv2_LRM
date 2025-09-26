<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessagingLeftConversation extends Model
{
    protected $table = 'messaging_left_conversations'; // Table name

    // Fillable attributes
    protected $fillable = [
        'u_id', 
        'fullName', 
        'leftConversationsData', 
        'statusFlag',
    ];

    // Cast the leftConversationsData to an array (or JSON)
    protected $casts = [
        'leftConversationsData' => 'array', // This ensures that leftConversationsData is treated as an array when accessed
    ];
}
