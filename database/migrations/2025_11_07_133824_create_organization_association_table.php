<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationAssociationTable extends Migration
{
    public function up(): void
    {
        Schema::create('organization_association', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('email');
            $table->json('organizationList')->nullable(); // can store large JSON data
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_association');
    }
}
