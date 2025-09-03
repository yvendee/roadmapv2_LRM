<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ScoreboardProjectProgressCard;
use Illuminate\Support\Str;

class ScoreboardProjectProgressCardSeeder extends Seeder
{
    public function run()
    {
        ScoreboardProjectProgressCard::create([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'projectProgressCardData' => json_encode([
                'completed' => 10,
                'total' => 36,
            ]),
            'statusFlag' => 'active',
        ]);
    }
}
