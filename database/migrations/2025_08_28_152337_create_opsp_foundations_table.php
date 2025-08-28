<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpspFoundationsTable extends Migration
{
    public function up()
    {
        Schema::create('opsp_foundations', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id');
            $table->string('organizationName');
            $table->json('foundationsData')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('opsp_foundations');
    }
}
