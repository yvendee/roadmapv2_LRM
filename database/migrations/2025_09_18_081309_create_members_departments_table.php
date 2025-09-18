<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersDepartmentsTable extends Migration
{
    public function up(): void
    {
        Schema::create('members_departments', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id'); 
            $table->string('organizationName');
            $table->json('membersDepartmentsData')->nullable(); // Large JSON or list data
            $table->string('statusFlag')->nullable(); // Optional status
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members_departments');
    }
}
