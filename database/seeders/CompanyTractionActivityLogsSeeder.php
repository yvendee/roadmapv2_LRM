<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompanyTractionActivityLogsSeeder extends Seeder
{
    public function run(): void
    {
        $activityLogs = [
            [
                'id' => 1,
                'author' => 'Maricar Aquino',
                'message' => 'Progress updated from % to 0% for Company Traction with description: Close target',
                'timestamp' => '2025-10-21T10:59:00',
            ],
            [
                'id' => 2,
                'author' => 'Nonyameko Hibbetts',
                'message' => 'Progress updated from 100% to 10% for Company Traction with description: 201 Evans Cnst',
                'timestamp' => '2025-10-20T14:00:00',
            ],
            [
                'id' => 3,
                'author' => 'Chuck Gulledge',
                'message' => 'Progress updated from % to 30% for Company Traction with description: Find the next project',
                'timestamp' => '2025-10-20T08:00:00',
            ],
            [
                'id' => 4,
                'author' => 'Chuck Gulledge',
                'message' => 'Company traction updated with description: Develop 2026 plan with Chuck and Team',
                'timestamp' => '2025-10-18T10:00:00',
            ],
            [
                'id' => 5,
                'author' => 'Nonyameko Hibbetts',
                'message' => 'Company traction created with description: Assist w/ Sale Closing Building E & O 2',
                'timestamp' => '2025-10-14T09:00:00',
            ],
        ];

        DB::table('company_traction_activity_logs')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'companyTractionActivityLogsData' => json_encode($activityLogs),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
