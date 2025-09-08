<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WhoWhatWhenSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id' => 1,
                'date' => '2025-03-31',
                'who' => 'Maricar',
                'what' => 'Systematize Coaching Framework (now called Momentum OS).',
                'deadline' => '2025-03-31',
                'comments' => 'approved',
                'status' => '100.00%',
            ],
            [
                'id' => 2,
                'date' => '2025-04-01',
                'who' => 'Chuck',
                'what' => 'Systematize Client Delivery.',
                'deadline' => '2025-03-31',
                'comments' => 'working',
                'status' => '83.33%',
            ],
            [
                'id' => 3,
                'date' => '2025-04-02',
                'who' => 'Kayven',
                'what' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
                'deadline' => '2025-03-31',
                'comments' => 'pending',
                'status' => '0.00%',
            ],
            [
                'id' => 4,
                'date' => '2025-04-02',
                'who' => 'John',
                'what' => 'Develop lead generation systems.',
                'deadline' => '2025-03-31',
                'comments' => 'paused',
                'status' => '50.00%',
            ],
            [
                'id' => 5,
                'date' => '2025-04-02',
                'who' => 'Grace',
                'what' => '1% Genius Version 3 Development.',
                'deadline' => '2025-03-31',
                'comments' => 'waiting',
                'status' => '50.00%',
            ],
        ];

        DB::table('who_what_when')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'whoWhatWhenData' => json_encode($data),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
