<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScoreboardCompanyTractionCardTable extends Migration
{
    public function up()
    {
        Schema::create('scoreboard_company_traction_card', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->json('companyTractionCardData')->nullable(); // for large JSON structure
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('scoreboard_company_traction_card');
    }
}
