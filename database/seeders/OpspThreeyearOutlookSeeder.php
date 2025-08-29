<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspThreeyearOutlookSeeder extends Seeder
{
    public function run()
    {
        DB::table('opsp_threeyear_outlook')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'threeyearOutlookData' => json_encode([
                [
                    'id' => 1,
                    'year' => '2026',
                    'value' => '1.0 Revenue of $4 Million',
                ],
                [
                    'id' => 2,
                    'year' => '2027',
                    'value' => '2.0 Revenue of $7 Million',
                ],
                [
                    'id' => 3,
                    'year' => '2028',
                    'value' => '3.0 Revenue of $9 Million',
                ],
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
