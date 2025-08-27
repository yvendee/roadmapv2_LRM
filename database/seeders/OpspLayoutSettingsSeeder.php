<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspLayoutSettingsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('opsp_layout_settings')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'strategicDriversStatus' => 'true',
            'FoundationsStatus' => 'true',
            'threeYearOutlookStatus' => 'true',
            'playingToWinStatus' => 'true',
            'coreCapabilitiesStatus' => 'true',
            'fourDecisionsStatus' => 'true',
            'ConstraintsTrackerStatus' => 'true',
            'modifiedByEmail' => null,
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
