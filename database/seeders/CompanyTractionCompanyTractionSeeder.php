<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompanyTractionCompanyTractionSeeder extends Seeder
{
    public function run(): void
    {
        $mockData = [
            'Chuck Gulledge Advisors, LLC' => [
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
            ],
        ];

        foreach ($mockData as $organization => $tractionData) {
            DB::table('company_traction_company_traction_table')->insert([
                'u_id' => Str::uuid(),
                'organizationName' => $organization,
                'companyTractionData' => json_encode($tractionData),
                'statusFlag' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
