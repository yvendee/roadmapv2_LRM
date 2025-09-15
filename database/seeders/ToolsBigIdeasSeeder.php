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
                    'description' => 'Systematize Coaching Framework (now called Momentum OS).',
                    'impact' => 'High',
                    'when' => '2025-04-02',
                    'evaluator' => 'Team A',
                    'comments' => 'Notes',
                ],
                [
                    'id' => 2,
                    'date' => '2025-04-03',
                    'who' => 'Kayven',
                    'description' => 'Systematize Client Delivery.',
                    'impact' => 'Medium',
                    'when' => '2025-04-02',
                    'evaluator' => 'Team A',
                    'comments' => 'Notes 1',
                ],
                [
                    'id' => 3,
                    'date' => '2025-04-03',
                    'who' => 'Kayven',
                    'description' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
                    'impact' => 'High',
                    'when' => '2025-04-02',
                    'evaluator' => 'Team B',
                    'comments' => 'Notes 2',
                ],
                [
                    'id' => 4,
                    'date' => '2025-04-04',
                    'who' => 'Kayven',
                    'description' => 'Develop lead generation systems.',
                    'impact' => 'Medium',
                    'when' => '2025-04-02',
                    'evaluator' => 'Team B',
                    'comments' => 'Notes 3',
                ],
                [
                    'id' => 5,
                    'date' => '2025-04-05',
                    'who' => 'Kayven',
                    'description' => '1% Genius Version 3 Development.',
                    'impact' => 'High',
                    'when' => '2025-04-02',
                    'evaluator' => 'Team C',
                    'comments' => 'Notes 4',
                ],
            ],
        ];

        foreach ($data as $org => $ideas) {
            ToolsBigIdea::create([
                'u_id' => Str::uuid(),
                'organizationName' => $org,
                'toolsBigIdeasData' => $ideas, // Assuming this is a JSON column in the database
                'statusFlag' => null,
            ]);
        }
    }
}
