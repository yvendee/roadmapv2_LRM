<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentTractionAnnualPrioritiesTable extends Migration
{
    public function up(): void
    {
        Schema::create('department_traction_annual_priorities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('u_id');
            $table->string('organizationName');
            $table->json('annualPrioritiesData')->nullable(); // JSON column
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_traction_annual_priorities');
    }
}
