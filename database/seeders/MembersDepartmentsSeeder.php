<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MembersDepartment;
use Illuminate\Support\Str;

class MembersDepartmentsSeeder extends Seeder
{
    public function run(): void
    {
        $organizationName = 'Chuck Gulledge Advisors, LLC';

        $membersDepartmentsData = [
            ['id' => 1, 'name' => 'Momentum OS'],
            ['id' => 2, 'name' => 'Client Delivery System'],
            ['id' => 3, 'name' => 'Momentum Hub'],
            ['id' => 4, 'name' => 'Lead Gen System'],
            ['id' => 5, 'name' => '1% Genius v3'],
        ];

        MembersDepartment::create([
            'u_id' => (string) Str::uuid(),
            'organizationName' => $organizationName,
            'membersDepartmentsData' => $membersDepartmentsData,
            'statusFlag' => null,
        ]);
    }
}
