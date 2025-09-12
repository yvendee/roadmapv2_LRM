<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoachingAlignmentWhatsNext;

class CoachingAlignmentWhatsNextSeeder extends Seeder
{
    public function run()
    {
        CoachingAlignmentWhatsNext::create([
            'u_id' => uniqid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'coachingAlignmentWhatsNextData' => [
                'whatsNextItems' => [
                    'Schedule leadership retreat',
                    'Finalize Q4 goals',
                ],
            ],
            'statusFlag' => null,
        ]);
    }
}
