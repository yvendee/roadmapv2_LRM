<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThirteenWeekSprintTable extends Migration
{
    public function up(): void
    {
        Schema::create('thirteen_week_sprint', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('thirteenWeekSprintData')->nullable(); // Stores large JSON/list
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('thirteen_week_sprint');
    }
}
