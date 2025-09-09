<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionDatesMonthlySessionsTrackerTable extends Migration
{
    public function up(): void
    {
        Schema::create('session_dates_monthly_sessions_tracker', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('sessionDatesMonthlySessionsTrackerData')->nullable(); // Big JSON data
            $table->string('statusFlag')->nullable();
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_dates_monthly_sessions_tracker');
    }
}
