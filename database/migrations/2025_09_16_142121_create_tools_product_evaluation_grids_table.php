<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToolsProductEvaluationGridsTable extends Migration
{
    public function up(): void
    {
        Schema::create('tools_product_evaluation_grids', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id');
            $table->string('organizationName');
            $table->json('toolsProductEvaluationGridsData')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tools_product_evaluation_grids');
    }
}
