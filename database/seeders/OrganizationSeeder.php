<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Organization;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        Organization::create([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'industry' => 'Technology',
            'size' => '50-100',
            'location' => 'New York',
            'token' => Str::random(40),
            'status' => 'active',
            'owner' => 'chuck.gulledge@gmail.com',
        ]);
    }
}
