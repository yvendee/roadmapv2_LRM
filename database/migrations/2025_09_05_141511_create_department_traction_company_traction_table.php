<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentTractionCompanyTractionTable extends Migration
{
    public function up(): void
    {
        Schema::create('department_traction_company_traction_table', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id');
            $table->string('organizationName');
            $table->json('companyTractionData')->nullable(); // For huge JSON list
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_traction_company_traction_table');
    }
}
