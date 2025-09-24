<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagingMessagesTable extends Migration
{
    public function up(): void
    {
        Schema::create('messaging_messages', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id');
            $table->string('fullName');
            $table->json('messagesData')->nullable(); // This column will store the huge list/data or JSON data
            $table->string('statusFlag')->nullable(); // statusFlag can be null
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messaging_messages');
    }
}
