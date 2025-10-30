<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyTractionQuarterTableCollectionTable extends Migration
{
    public function up(): void
    {
        Schema::create('company_traction_quarter_table_collection', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->string('tag')->nullable();
            $table->json('companyTractionData')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_traction_quarter_table_collection');
    }
}
