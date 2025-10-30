<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\DepartmentTractionQuarterTableCollection;

class DepartmentTractionQuarterTableCollectionSeeder extends Seeder
{
    public function run(): void
    {
        $organizationName = 'Chuck Gulledge Advisors, LLC';

        $data = [
            'Q1' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'John',
                    'description' => 'Design new social media campaign',
                    'progress' => '20%',
                    'priority' => 'Enhance online visibility',
                    'dueDate' => '03-31-2025',
                    'rank' => '1',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'Initial concepts drafted.',
                            'posted' => '25 June 2025',
                        ],
                        [
                            'author' => 'John',
                            'message' => 'Looks great — need client review.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],
            ],
            'Q2' => [
                [
                    'id' => 1,
                    'who' => 'John',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch email newsletter system',
                    'progress' => '0%',
                    'priority' => 'Enhance customer engagement',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'John',
                            'message' => 'Setting up templates.',
                            'posted' => '01 July 2025',
                        ],
                    ],
                ],
            ],
            'Q3' => [],
            'Q4' => [],
        ];

        DepartmentTractionQuarterTableCollection::create([
            'u_id' => Str::uuid(),
            'organizationName' => $organizationName,
            'tag' => '2025',
            'departmentTractionData' => $data,
            'statusFlag' => null,
        ]);
    }
}
