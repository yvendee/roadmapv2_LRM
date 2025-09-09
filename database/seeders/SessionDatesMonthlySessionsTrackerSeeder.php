<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SessionDatesMonthlySessionsTracker;
use Illuminate\Support\Str;

class SessionDatesMonthlySessionsTrackerSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                ['date' => '2025-07-01', 'status' => 'done', 'details' => 'Strategy alignment'],
                ['date' => '2025-07-15', 'status' => 'pending', 'details' => 'KPI review'],
                ['date' => '2025-07-25', 'status' => 'new', 'details' => 'Planning'],
                ['date' => '2025-08-05', 'status' => 'pending', 'details' => 'Forecasting'],
            ],
        ];

        foreach ($data as $organization => $sessionData) {
            SessionDatesMonthlySessionsTracker::create([
                'u_id' => Str::uuid(),
                'organizationName' => $organization,
                'sessionDatesMonthlySessionsTrackerData' => $sessionData,
                'statusFlag' => null,
            ]);
        }
    }
}
