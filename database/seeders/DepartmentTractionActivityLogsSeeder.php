<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DepartmentTractionActivityLogsSeeder extends Seeder
{
    public function run(): void
    {
        $activityLogs = [
            [
                'id' => 1,
                'author' => 'Jane Doe',
                'message' => 'Department progress updated from % to 20% for Marketing Goals',
                'timestamp' => '2025-10-21T11:30:00',
            ],
            [
                'id' => 2,
                'author' => 'John Smith',
                'message' => 'Department traction updated: Launch Q4 campaign',
                'timestamp' => '2025-10-20T15:45:00',
            ],
        ];

        DB::table('department_traction_activity_logs')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'departmentTractionActivityLogsData' => json_encode($activityLogs),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
