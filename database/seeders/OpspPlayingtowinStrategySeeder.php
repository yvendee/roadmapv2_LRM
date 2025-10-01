<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OpspPlayingtowinStrategy;
use Illuminate\Support\Str;

class OpspPlayingtowinStrategySeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'title' => '2026',
                'value' => '1.0 Revenue of $4 Million',
            ],
            [
                'id' => 2,
                'title' => '2027',
                'value' => '2.0 Revenue of $7 Million',
            ],
            [
                'id' => 3,
                'title' => '2028',
                'value' => '3.0 Revenue of $9 Million',
            ],
        ];

        OpspPlayingtowinStrategy::create([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'playingToWinStrategyData' => json_encode($data),
            'statusFlag' => null,
        ]);
    }
}
