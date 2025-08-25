<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuthTable extends Migration
{
    public function up(): void
    {
        Schema::create('auth', function (Blueprint $table) {
            $table->id(); // id (auto-increment primary key)
            $table->string('u_id')->unique(); // unique user identifier
            $table->string('firstName');
            $table->string('lastName');
            $table->string('email')->unique();
            $table->string('organization')->nullable();
            $table->string('passwordHash');
            $table->string('role');
            $table->string('group')->nullable();
            $table->string('position')->nullable();
            $table->string('status')->nullable();
            $table->string('resetCode')->nullable();
            $table->timestamp('expireAt')->nullable();
            $table->text('token')->nullable();
            $table->text('accessToken')->nullable();
            $table->text('refreshToken')->nullable();
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auth');
    }
}
