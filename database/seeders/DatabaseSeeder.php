<?php

namespace Database\Seeders;

// database\seeders\DatabaseSeeder.php

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

   
        // $this->call([AuthTableSeeder::class,]);
        // $this->call(OrganizationSeeder::class);
        // $this->call(OpspLayoutSettingsSeeder::class);
        // $this->call(OpspStrategicDriversSeeder::class);
        // $this->call(OpspFoundationsSeeder::class);
        // $this->call(OpspThreeyearOutlookSeeder::class);
        // $this->call(OpspPlayingtowinStrategySeeder::class);
        // $this->call(OpspCoreCapabilitiesSeeder::class);
        // $this->call(OpspFourDecisionsSeeder::class);
        // $this->call(OpspConstraintsTrackerSeeder::class);
        // $this->call(FlywheelSeeder::class);
        // $this->call(ScoreboardAnnualprioritiesSeeder::class);
        // $this->call(ScoreboardCompanyTractionCardSeeder::class);
        // $this->call(ScoreboardProjectProgressCardSeeder::class);
        $this->call(GccMetricsSeeder::class);
        
        
        
        
        
        



    }


}
