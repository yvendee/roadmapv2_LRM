<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToolsBigIdeasTable extends Migration
{
    public function up(): void
    {
        Schema::create('tools_big_ideas', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('toolsBigIdeasData')->nullable(); // Huge list or JSON data
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tools_big_ideas');
    }
}

