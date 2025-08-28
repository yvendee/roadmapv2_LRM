<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspFoundationsSeeder extends Seeder
{
    public function run()
    {
        $foundations = [
            [
                'id' => 1,
                'title' => 'Our Aspiration',
                'content' => '"To be renowned as the premier coaching organization that transforms how companies achieve their optimal exits."',
            ],
            [
                'id' => 2,
                'title' => 'Our Purpose / Mission',
                'content' => "Our purpose is:\n\nDevelop transformative coaching methodologies and frameworks.\nDeliver extraordinary, measurable results for our clients.\n\nOur organizational culture is designed so all team members win.",
            ],
            [
                'id' => 3,
                'title' => 'Brand Promise',
                'content' => '',
            ],
            [
                'id' => 4,
                'title' => 'Profit Per X',
                'content' => '',
            ],
            [
                'id' => 5,
                'title' => 'BHAG',
                'content' => '$100 Billion in Exit Value',
            ],
            [
                'id' => 6,
                'title' => '3HAG',
                'content' => '$7Mil in Revenue by 2027',
            ],
        ];

        DB::table('opsp_foundations')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'foundationsData' => json_encode($foundations),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
