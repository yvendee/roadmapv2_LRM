<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminPanelCompany;
use Illuminate\Support\Str;

class AdminPanelCompanySeeder extends Seeder
{
    public function run()
    {
        AdminPanelCompany::create([
            'u_id' => Str::uuid(),
            'organizationName' => 'eDoc Innovation',
            'companiesData' => [
                'quarters' => [
                    'Q1' => ['January', 'February'],
                    'Q2' => [''],
                    'Q3' => [''],
                    'Q4' => [''],
                ],
            ],
            'statusFlag' => null, // can be set to something like 'active'
        ]);
    }
}
