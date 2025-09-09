<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SessionDatesQuarterlySessions;
use Illuminate\Support\Str;

class SessionDatesQuarterlySessionsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'status' => 'Completed',
                    'quarter' => 'Q1 2025',
                    'meetingDate' => 'January 20, 2025',
                    'agenda' => 'Strategic Planning & KPIs',
                    'recap' => 'Shared Q1 goals and budget updates',
                ],
                [
                    'status' => 'Scheduled',
                    'quarter' => 'Q2 2025',
                    'meetingDate' => 'April 22, 2025',
                    'agenda' => 'Customer Retention Plans',
                    'recap' => 'To be added after session',
                ],
                [
                    'status' => 'Pending',
                    'quarter' => 'Q3 2025',
                    'meetingDate' => 'July 15, 2025',
                    'agenda' => 'New Product Launch Discussion',
                    'recap' => 'To be added',
                ],
                [
                    'status' => 'Upcoming',
                    'quarter' => 'Q4 2025',
                    'meetingDate' => 'October 17, 2025',
                    'agenda' => 'Annual Review & Strategy 2026',
                    'recap' => 'To be added',
                ],
            ],
        ];

        foreach ($data as $organizationName => $sessionData) {
            SessionDatesQuarterlySessions::create([
                'u_id' => Str::uuid(),
                'organizationName' => $organizationName,
                'sessionDatesQuarterlySessionsData' => $sessionData,
                'statusFlag' => null,
            ]);
        }
    }
}
