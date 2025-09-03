<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Flywheel;

class FlywheelSeeder extends Seeder
{
    public function run()
    {
        Flywheel::create([
            'u_id' => 1,
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'fileLink' => '/flywheel/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5x/test.pdf',
            'statusFlag' => 'active',
        ]);
    }
}
