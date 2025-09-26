<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessagingLeftConversation extends Model
{
    use HasFactory;

    protected $table = 'messaging_left_conversations'; // Table name
    protected $primaryKey = 'id'; // Primary key
    public $timestamps = true; // Enable timestamps (created_at, updated_at)

    protected $fillable = [
        'u_id',
        'fullName',
        'leftConversationsData',
        'statusFlag',
    ];

    // Cast the leftConversationsData column to an array
    protected $casts = [
        'leftConversationsData' => 'array', // Cast JSON column to an array
    ];
}
