<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagingLeftConversationsTable extends Migration
{
    public function up()
    {
        Schema::create('messaging_left_conversations', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('u_id'); // Unique identifier for the user
            $table->string('fullName'); // Full name of the user
            $table->json('leftConversationsData')->nullable(); // Store conversation data as JSON
            $table->string('statusFlag')->nullable(); // Status flag (nullable)
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    public function down()
    {
        Schema::dropIfExists('messaging_left_conversations');
    }
}
