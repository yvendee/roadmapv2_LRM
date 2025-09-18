<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersDirectoryTable extends Migration
{
    public function up(): void
    {
        Schema::create('members_directory', function (Blueprint $table) {
            $table->id();
            $table->uuid('u_id');
            $table->string('organizationName');
            $table->json('membersDirectoryData')->nullable(); // Can store large JSON
            $table->string('statusFlag')->nullable(); // Nullable flag
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members_directory');
    }
}
