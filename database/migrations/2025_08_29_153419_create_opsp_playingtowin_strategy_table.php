<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpspPlayingtowinStrategyTable extends Migration
{
    public function up()
    {
        Schema::create('opsp_playingtowin_strategy', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('u_id');
            $table->string('organizationName');
            $table->longText('playingToWinStrategyData')->nullable(); // JSON or large text
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('opsp_playingtowin_strategy');
    }
}

