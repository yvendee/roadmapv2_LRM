<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GccMetric;
use Illuminate\Support\Str;

class GccMetricsSeeder extends Seeder
{
    public function run()
    {
        GccMetric::create([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'metricsData' => json_encode([
                [
                    'title' => 'Checks Processed',
                    'percent' => 30,
                    'annualGoal' => 20000,
                    'current' => 18888,
                    'monthlyData' => [
                        ['month' => 'Jan', 'goal' => 1500, 'current' => 1300, 'progress' => 87],
                        ['month' => 'Feb', 'goal' => 1500, 'current' => 1700, 'progress' => 113],
                        ['month' => 'Mar', 'goal' => 1800, 'current' => 2000, 'progress' => 111],
                        ['month' => 'Apr', 'goal' => 1700, 'current' => 1600, 'progress' => 94],
                        ['month' => 'May', 'goal' => 1600, 'current' => 1650, 'progress' => 103],
                        ['month' => 'Jun', 'goal' => 1700, 'current' => 1850, 'progress' => 109],
                        ['month' => 'Jul', 'goal' => 1700, 'current' => 1700, 'progress' => 100],
                        ['month' => 'Aug', 'goal' => 1600, 'current' => 1600, 'progress' => 100],
                        ['month' => 'Sep', 'goal' => 1800, 'current' => 1700, 'progress' => 94],
                        ['month' => 'Oct', 'goal' => 1600, 'current' => 1700, 'progress' => 106],
                        ['month' => 'Nov', 'goal' => 1400, 'current' => 1388, 'progress' => 99],
                        ['month' => 'Dec', 'goal' => 1500, 'current' => 1800, 'progress' => 120]
                    ],
                    'quarterlyData' => [
                        ['quarter' => 'Q1', 'goal' => 4800, 'current' => 5000, 'progress' => 104],
                        ['quarter' => 'Q2', 'goal' => 5000, 'current' => 5100, 'progress' => 102],
                        ['quarter' => 'Q3', 'goal' => 5100, 'current' => 5000, 'progress' => 98],
                        ['quarter' => 'Q4', 'goal' => 4500, 'current' => 4788, 'progress' => 106]
                    ]
                ],
                [
                    'title' => 'Number of Customers',
                    'percent' => 50,
                    'annualGoal' => 1000,
                    'current' => 500,
                    'monthlyData' => [
                        ['month' => 'Jan', 'goal' => 80, 'current' => 40, 'progress' => 50],
                        ['month' => 'Feb', 'goal' => 90, 'current' => 50, 'progress' => 56],
                        ['month' => 'Mar', 'goal' => 100, 'current' => 60, 'progress' => 60],
                        ['month' => 'Apr', 'goal' => 90, 'current' => 70, 'progress' => 78],
                        ['month' => 'May', 'goal' => 90, 'current' => 80, 'progress' => 89],
                        ['month' => 'Jun', 'goal' => 80, 'current' => 60, 'progress' => 75],
                        ['month' => 'Jul', 'goal' => 90, 'current' => 70, 'progress' => 78],
                        ['month' => 'Aug', 'goal' => 90, 'current' => 70, 'progress' => 78],
                        ['month' => 'Sep', 'goal' => 100, 'current' => 0, 'progress' => 0],
                        ['month' => 'Oct', 'goal' => 90, 'current' => 0, 'progress' => 0],
                        ['month' => 'Nov', 'goal' => 60, 'current' => 0, 'progress' => 0],
                        ['month' => 'Dec', 'goal' => 60, 'current' => 0, 'progress' => 0]
                    ],
                    'quarterlyData' => [
                        ['quarter' => 'Q1', 'goal' => 270, 'current' => 150, 'progress' => 56],
                        ['quarter' => 'Q2', 'goal' => 260, 'current' => 210, 'progress' => 81],
                        ['quarter' => 'Q3', 'goal' => 280, 'current' => 140, 'progress' => 50],
                        ['quarter' => 'Q4', 'goal' => 210, 'current' => 0, 'progress' => 0]
                    ]
                ],
                [
                    'title' => 'Profit per X',
                    'percent' => 89,
                    'annualGoal' => 120000,
                    'current' => 106800,
                    'monthlyData' => [
                        ['month' => 'Jan', 'goal' => 10000, 'current' => 9000, 'progress' => 90],
                        ['month' => 'Feb', 'goal' => 10000, 'current' => 9600, 'progress' => 96],
                        ['month' => 'Mar', 'goal' => 10000, 'current' => 9700, 'progress' => 97],
                        ['month' => 'Apr', 'goal' => 10000, 'current' => 8800, 'progress' => 88],
                        ['month' => 'May', 'goal' => 10000, 'current' => 9200, 'progress' => 92],
                        ['month' => 'Jun', 'goal' => 10000, 'current' => 9100, 'progress' => 91],
                        ['month' => 'Jul', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                        ['month' => 'Aug', 'goal' => 10000, 'current' => 9500, 'progress' => 95],
                        ['month' => 'Sep', 'goal' => 10000, 'current' => 9500, 'progress' => 95],
                        ['month' => 'Oct', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                        ['month' => 'Nov', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                        ['month' => 'Dec', 'goal' => 10000, 'current' => 10000, 'progress' => 100]
                    ],
                    'quarterlyData' => [
                        ['quarter' => 'Q1', 'goal' => 30000, 'current' => 28300, 'progress' => 94],
                        ['quarter' => 'Q2', 'goal' => 30000, 'current' => 27100, 'progress' => 90],
                        ['quarter' => 'Q3', 'goal' => 30000, 'current' => 29000, 'progress' => 97],
                        ['quarter' => 'Q4', 'goal' => 30000, 'current' => 22400, 'progress' => 75]
                    ],
                ]
            ]),
            'statusFlag' => null,
        ]);
    }
}
