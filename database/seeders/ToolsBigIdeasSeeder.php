<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ToolsBigIdea;
use Illuminate\Support\Str;

class ToolsBigIdeasSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'id' => 1,
                    'date' => '2025-04-02',
                    'who' => 'Kayven',
                    'milestones' => 'Systematize Coaching Framework (now called Momentum OS).',
                    'notes' => 'Notes ',
                ],
                [
                    'id' => 2,
                    'date' => '2025-04-03',
                    'who' => 'Kayven',
                    'milestones' => 'Systematize Client Delivery.',
                    'notes' => 'Notes 1',
                ],
                [
                    'id' => 3,
                    'date' => '2025-04-03',
                    'who' => 'Kayven',
                    'milestones' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
                    'notes' => 'Notes 2',
                ],
                [
                    'id' => 4,
                    'date' => '2025-04-04',
                    'who' => 'Kayven',
                    'milestones' => 'Develop lead generation systems.',
                    'notes' => 'Notes 3',
                ],
                [
                    'id' => 5,
                    'date' => '2025-04-05',
                    'who' => 'Kayven',
                    'milestones' => '1% Genius Version 3 Development.',
                    'notes' => 'Notes 4',
                ],
            ],
        ];

        foreach ($data as $org => $ideas) {
            ToolsBigIdea::create([
                'u_id' => Str::uuid(),
                'organizationName' => $org,
                'toolsBigIdeasData' => $ideas,
                'statusFlag' => null,
            ]);
        }
    }
}
