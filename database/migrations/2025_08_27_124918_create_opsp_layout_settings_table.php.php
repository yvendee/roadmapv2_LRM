<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpspLayoutSettingsTable extends Migration
{
    public function up(): void
    {
        Schema::create('opsp_layout_settings', function (Blueprint $table) {
            $table->id();
            $table->string('u_id');
            $table->string('organizationName');
            $table->string('strategicDriversStatus')->default('true');
            $table->string('FoundationsStatus')->default('true');
            $table->string('threeYearOutlookStatus')->default('true');
            $table->string('playingToWinStatus')->default('true');
            $table->string('coreCapabilitiesStatus')->default('true');
            $table->string('fourDecisionsStatus')->default('true');
            $table->string('ConstraintsTrackerStatus')->default('true');
            $table->string('modifiedByEmail')->nullable();
            $table->string('statusFlag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opsp_layout_settings');
    }
}
