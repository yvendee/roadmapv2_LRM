<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminPanelCompaniesTable extends Migration
{
    public function up()
    {
        Schema::create('admin_panel_companies', function (Blueprint $table) {
            $table->id();
            $table->string('u_id'); 
            $table->string('organizationName');
            $table->json('companiesData')->nullable(); // Can store large JSON data
            $table->string('statusFlag')->nullable();  // Optional status flag
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('admin_panel_companies');
    }
}
