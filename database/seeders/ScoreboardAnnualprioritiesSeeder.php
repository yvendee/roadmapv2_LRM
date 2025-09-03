<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ScoreboardAnnualpriority;
use Illuminate\Support\Str;

class ScoreboardAnnualprioritiesSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                'average' => 64.28,
                'members' => [
                    ['name' => 'Maricar Aquino', 'score' => 100],
                    ['name' => 'Chuck Gulledge', 'score' => 71],
                    ['name' => '', 'score' => 22],
                ],
            ],
        ];

        foreach ($data as $org => $priorities) {
            ScoreboardAnnualpriority::create([
                'u_id' => Str::uuid(),
                'organizationName' => $org,
                'annualPrioritiesdData' => $priorities,
                'statusFlag' => 'active',
            ]);
        }
    }
}
