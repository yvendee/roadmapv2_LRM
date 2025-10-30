<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\CompanyTractionQuarterTableCollection;

class CompanyTractionQuarterTableCollectionSeeder extends Seeder
{
    public function run(): void
    {
        $organizationName = 'Chuck Gulledge Advisors, LLC';

        $data = [
            'Q1' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Build landing page',
                    'progress' => '5%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => '03-31-2025',
                    'rank' => '1',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                        [
                            'author' => 'John',
                            'message' => 'Great work on this!',
                            'posted' => '27 June 2025',
                        ],
                    ],
                ],
            ],
            'Q2' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],
            ],
            'Q3' => [],
            'Q4' => [],
        ];

        CompanyTractionQuarterTableCollection::create([
            'u_id' => Str::uuid(),
            'organizationName' => $organizationName,
            'tag' => '2025',
            'companyTractionData' => $data,
            'statusFlag' => null,
        ]);
    }
}
