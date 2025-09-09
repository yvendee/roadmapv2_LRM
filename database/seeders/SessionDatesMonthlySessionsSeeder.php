<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SessionDatesMonthlySessions;
use Illuminate\Support\Str;

class SessionDatesMonthlySessionsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'status' => 'Done',
                    'month' => 'January',
                    'date' => '2025-01-10',
                    'agenda' => 'Review January goals and targets',
                    'recap' => 'All targets met. Positive team performance.',
                ],
                [
                    'status' => 'Pending',
                    'month' => 'February',
                    'date' => '2025-02-14',
                    'agenda' => 'Mid-Q1 Alignment & Budget Discussion',
                    'recap' => 'To be conducted.',
                ],
                [
                    'status' => 'New',
                    'month' => 'March',
                    'date' => '2025-03-20',
                    'agenda' => 'Client Feedback Analysis',
                    'recap' => 'Preparation ongoing.',
                ],
            ],
        ];

        foreach ($data as $organization => $sessionData) {
            SessionDatesMonthlySessions::create([
                'u_id' => Str::uuid(),
                'organizationName' => $organization,
                'sessionDatesMonthlySessionsData' => $sessionData,
                'statusFlag' => null,
            ]);
        }
    }
}
