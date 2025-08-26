<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id')->unique();
            $table->string('organizationName');
            $table->string('industry')->nullable();
            $table->string('size')->nullable();
            $table->string('location')->nullable();
            $table->text('token')->nullable();
            $table->string('status')->nullable();
            $table->string('owner')->nullable();
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};

