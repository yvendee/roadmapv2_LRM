<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GccFinancialGrowthSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('gcc_financial_growth')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'financialGrowthData' => json_encode([
                ['year' => '2023', 'revenueGrowth' => 5, 'cogsGrowth' => 3],
                ['year' => '2024', 'revenueGrowth' => 12, 'cogsGrowth' => 10],
                ['year' => '2025', 'revenueGrowth' => 9, 'cogsGrowth' => 7],
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
