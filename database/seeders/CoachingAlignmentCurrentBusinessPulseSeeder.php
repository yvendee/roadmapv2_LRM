<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoachingAlignmentCurrentBusinessPulse;

class CoachingAlignmentCurrentBusinessPulseSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'category' => 'Strategic Clarity',
                    'rating' => 2,
                    'notes' => ['Need clearer vision shared', 'Stakeholder alignment required'],
                ],
                [
                    'category' => 'Execution Discipline',
                    'rating' => 3,
                    'notes' => ['Better task tracking', 'Set clear milestones'],
                ],
                [
                    'category' => 'Leadership & Team Health',
                    'rating' => 4,
                    'notes' => ['Strong collaboration', 'Trust increasing'],
                ],
            ],
        ];

        foreach ($data as $orgName => $pulseData) {
            CoachingAlignmentCurrentBusinessPulse::create([
                'u_id' => uniqid(),
                'organizationName' => $orgName,
                'coachingAlignmentCurrentBusinessPulseData' => $pulseData,
                'statusFlag' => null,
            ]);
        }
    }
}
