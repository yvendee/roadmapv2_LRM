<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrganizationAssociationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('organization_association')->insert([
            'u_id' => Str::uuid(),
            'email' => 'maricar@chuckgulledge.com',
            'organizationList' => json_encode([
                'Chuck Gulledge Advisors, LLC',
                'eDoc Innovation',
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
