<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspCoreCapabilitiesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('opsp_core_capabilities')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'coreCapabilitiesData' => json_encode([
                ['id' => 1, 'description' => 'Leadership Training', 'orig' => '✓', 'q1' => 'x', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
                ['id' => 2, 'description' => 'Technology Stack', 'orig' => 'x', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
