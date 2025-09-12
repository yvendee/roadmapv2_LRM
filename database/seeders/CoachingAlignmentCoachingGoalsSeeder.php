<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoachingAlignmentCoachingGoal;

class CoachingAlignmentCoachingGoalsSeeder extends Seeder
{
    public function run(): void
    {
        CoachingAlignmentCoachingGoal::create([
            'u_id' => uniqid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'coachingAlignmentCoachingGoalsData' => [
                'coachingGoalsItems' => [
                    'Build high-impact team',
                    'Increase client engagement',
                    'Develop Momentum Hub',
                ],
            ],
            'statusFlag' => null,
        ]);
    }
}
