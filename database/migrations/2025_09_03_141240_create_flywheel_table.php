<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlywheelTable extends Migration
{
    public function up()
    {
        Schema::create('flywheel', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('u_id');
            $table->string('organizationName');
            $table->text('fileLink')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('flywheel');
    }
}

