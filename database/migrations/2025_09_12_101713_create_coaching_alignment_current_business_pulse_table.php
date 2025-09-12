<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoachingAlignmentCurrentBusinessPulseTable extends Migration
{
    public function up()
    {
        Schema::create('coaching_alignment_current_business_pulse', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('coachingAlignmentCurrentBusinessPulseData')->nullable(); // JSON, large list
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('coaching_alignment_current_business_pulse');
    }
}
