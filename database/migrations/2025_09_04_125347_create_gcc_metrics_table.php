<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGccMetricsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('gcc_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('metricsData')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('gcc_metrics');
    }
}

