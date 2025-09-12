<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoachingAlignmentCurrentFocus;

class CoachingAlignmentCurrentFocusSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                'focusItems' => [
                    'Enhance leadership training',
                    'Streamline team communication',
                ],
            ],
        ];

        foreach ($data as $orgName => $focusData) {
            CoachingAlignmentCurrentFocus::create([
                'u_id' => uniqid(),
                'organizationName' => $orgName,
                'coachingAlignmentCurrentFocusData' => $focusData,
                'statusFlag' => null,
            ]);
        }
    }
}
