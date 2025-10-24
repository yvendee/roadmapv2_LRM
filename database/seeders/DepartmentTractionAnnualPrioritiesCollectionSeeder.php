<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DepartmentTractionAnnualPrioritiesCollection;
use Illuminate\Support\Str;

class DepartmentTractionAnnualPrioritiesCollectionSeeder extends Seeder
{
    public function run(): void
    {
        $organizationName = 'Chuck Gulledge Advisors, LLC';

        $departmentData = [
            [
                'id' => 1,
                'description' => 'Improve department communication efficiency.',
                'status' => '80.00%',
            ],
            [
                'id' => 2,
                'description' => 'Enhance department-level training programs.',
                'status' => '70.00%',
            ],
            [
                'id' => 3,
                'description' => 'Implement KPI dashboards for team tracking.',
                'status' => '60.00%',
            ],
            [
                'id' => 4,
                'description' => 'Increase departmental collaboration across teams.',
                'status' => '50.00%',
            ],
        ];

        DepartmentTractionAnnualPrioritiesCollection::create([
            'u_id' => Str::uuid(),
            'organizationName' => $organizationName,
            'tag' => "2025",
            'departmentTractionData' => $departmentData,
            'statusFlag' => null,
        ]);
    }
}
