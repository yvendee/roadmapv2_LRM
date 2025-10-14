<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionDatesQuarterlySessionsTable extends Migration
{
    public function up(): void
    {
        Schema::create('session_dates_quarterly_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('sessionDatesQuarterlySessionsData')->nullable(); // can store large structured data
            $table->string('statusFlag')->nullable();
            $table->timestamps(); // creates created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_dates_quarterly_sessions');
    }
}

