<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionDatesMonthlySessionsTable extends Migration
{
    public function up(): void
    {
        Schema::create('session_dates_monthly_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->longText('sessionDatesMonthlySessionsData')->nullable(); // To store large JSON data
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_dates_monthly_sessions');
    }
}
