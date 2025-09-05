<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DepartmentTractionAnnualPrioritiesSeeder extends Seeder
{
    public function run(): void
    {
        $mockData = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'id' => 1,
                    'description' => 'Systematize Coaching Framework (now called Momentum OS).',
                    'status' => '100.00%',
                ],
                [
                    'id' => 2,
                    'description' => 'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
                    'status' => '75.00%',
                ],
                [
                    'id' => 3,
                    'description' => 'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
                    'status' => '60.00%',
                ],
                [
                    'id' => 4,
                    'description' => 'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
                    'status' => '45.00%',
                ],
            ],
        ];

        foreach ($mockData as $organization => $annualPriorities) {
            DB::table('department_traction_annual_priorities')->insert([
                'u_id' => Str::uuid(),
                'organizationName' => $organization,
                'annualPrioritiesData' => json_encode($annualPriorities),
                'statusFlag' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
