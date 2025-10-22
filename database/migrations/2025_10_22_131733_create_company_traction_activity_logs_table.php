<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyTractionActivityLogsTable extends Migration
{
    public function up(): void
    {
        Schema::create('company_traction_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('companyTractionActivityLogsData')->nullable(); // stores big JSON
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_traction_activity_logs');
    }
}
