<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ToolsIssue;
use Illuminate\Support\Str;

class ToolsIssuesTableSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'id' => 1,
                    'issueName' => 'System Issue 1',
                    'description' => 'Systematize Coaching Framework (now called Momentum OS).',
                    'status' => '100.00%',
                    'dateLogged' => '2025-03-31',
                    'who' => 'Kayven',
                    'resolution' => 'resolution here',
                    'dateResolved' => '2025-04-02',
                ],
                [
                    'id' => 2,
                    'issueName' => 'System Issue 2',
                    'description' => 'Systematize Client Delivery.',
                    'status' => '83.33%',
                    'dateLogged' => '2025-03-29',
                    'who' => 'Kayven',
                    'resolution' => 'resolution here 1',
                    'dateResolved' => '2025-04-03',
                ],
                [
                    'id' => 3,
                    'issueName' => 'System Issue 2',
                    'description' => 'Develop online Portal for Clients (Momentum Hub).',
                    'status' => '0.00%',
                    'dateLogged' => '2025-03-28',
                    'who' => 'Kayven',
                    'resolution' => 'resolution here 2',
                    'dateResolved' => '2025-04-03',
                ],
                [
                    'id' => 4,
                    'issueName' => 'System Issue 3',
                    'description' => 'Develop lead generation systems.',
                    'status' => '50.00%',
                    'dateLogged' => '2025-03-27',
                    'who' => 'Kayven',
                    'resolution' => 'resolution here 3',
                    'dateResolved' => '2025-04-04',
                ],
                [
                    'id' => 5,
                    'issueName' => 'System Issue 4',
                    'description' => '1% Genius Version 3 Development.',
                    'status' => '50.00%',
                    'dateLogged' => '2025-03-26',
                    'who' => 'Kayven',
                    'resolution' => 'resolution here 4',
                    'dateResolved' => '2025-04-05',
                ],
            ],
        ];

        foreach ($data as $organizationName => $issues) {
            ToolsIssue::create([
                'u_id' => Str::uuid(),
                'organizationName' => $organizationName,
                'toolsIssuesData' => $issues,
                'statusFlag' => null,
            ]);
        }
    }
}
