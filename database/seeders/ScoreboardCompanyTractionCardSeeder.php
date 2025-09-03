<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\ScoreboardCompanyTractionCard;

class ScoreboardCompanyTractionCardSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                ['label' => 'Q1', 'percent' => 100],
                ['label' => 'Q2', 'percent' => 93],
                ['label' => 'Q3', 'percent' => 5],
                ['label' => 'Q4', 'percent' => 0],
            ],
        ];

        foreach ($data as $organizationName => $tractionData) {
            ScoreboardCompanyTractionCard::create([
                'u_id' => Str::uuid(),
                'organizationName' => $organizationName,
                'companyTractionCardData' => $tractionData,
                'statusFlag' => 'active',
            ]);
        }
    }
}
