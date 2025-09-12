<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoachingAlignmentCoachingGoalsTable extends Migration
{
    public function up(): void
    {
        Schema::create('coaching_alignment_coaching_goals', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('coachingAlignmentCoachingGoalsData')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coaching_alignment_coaching_goals');
    }
}
