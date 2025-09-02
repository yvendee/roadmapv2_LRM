<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspFourDecisionsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('opsp_fourDecisions')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'fourDecisionsData' => json_encode([
                ['id' => 1, 'description' => 'Budget Allocation', 'orig' => 'x', 'q1' => 'x', 'q2' => '✓', 'q3' => 'x', 'q4' => '✓'],
                ['id' => 2, 'description' => 'Product Launch', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => '✓', 'q4' => 'x'],
                ['id' => 3, 'description' => 'Market Research', 'orig' => 'x', 'q1' => 'x', 'q2' => 'x', 'q3' => '✓', 'q4' => '✓'],
                ['id' => 4, 'description' => 'Customer Feedback', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => '✓'],
                ['id' => 5, 'description' => 'Team Collaboration', 'orig' => 'x', 'q1' => 'x', 'q2' => '✓', 'q3' => 'x', 'q4' => 'x'],
                ['id' => 6, 'description' => 'Sales Strategy', 'orig' => '✓', 'q1' => 'x', 'q2' => 'x', 'q3' => '✓', 'q4' => '✓'],
                ['id' => 7, 'description' => 'Quality Control', 'orig' => 'x', 'q1' => '✓', 'q2' => '✓', 'q3' => 'x', 'q4' => 'x'],
                ['id' => 8, 'description' => 'Employee Engagement', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => '✓', 'q4' => 'x'],
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
