<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspStrategicDriversSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('opsp_strategic_drivers')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'strategicDriversData' => json_encode([
                [
                    'id' => 1,
                    'title' => 'Solution Innovation',
                    'description' => 'Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise.',
                    'kpi' => 'Launch 2 scalable products',
                    'status' => 'Tracking',
                ],
                [
                    'id' => 2,
                    'title' => 'Talent Leadership',
                    'description' => 'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
                    'kpi' => 'Hire 5 elite coaches',
                    'status' => 'Behind',
                ],
                [
                    'id' => 3,
                    'title' => 'Exceptional Delivery',
                    'description' => 'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
                    'kpi' => 'Achieve 90% 10/10 ratings',
                    'status' => 'At Risk',
                ],
                [
                    'id' => 4,
                    'title' => 'Market Dominance',
                    'description' => 'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
                    'kpi' => 'Grow referral traffic by 30%',
                    'status' => 'Paused',
                ],
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
