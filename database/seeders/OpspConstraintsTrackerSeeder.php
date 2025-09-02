<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OpspConstraintsTrackerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('opsp_constraints_tracker')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'constraintsTrackerData' => json_encode([
                ['id' => 1, 'constraintTitle' => 'Leadership Training', 'description' => 'Pending', 'owner' => 'Maricar', 'actions' => 'In Progress', 'status' => 'Tracking'],
                ['id' => 2, 'constraintTitle' => 'Technology Stack', 'description' => 'Completed', 'owner' => 'Maricar', 'actions' => 'Ongoing', 'status' => 'Tracking'],
                ['id' => 3, 'constraintTitle' => 'Budget Allocation', 'description' => 'Reviewed', 'owner' => 'Maricar', 'actions' => 'Scheduled', 'status' => 'Tracking'],
                ['id' => 4, 'constraintTitle' => 'Customer Feedback', 'description' => 'Pending', 'owner' => 'Maricar', 'actions' => 'Completed', 'status' => 'Tracking'],
                ['id' => 5, 'constraintTitle' => 'Product Launch', 'description' => 'Approved', 'owner' => 'Maricar', 'actions' => 'In Progress', 'status' => 'Tracking'],
                ['id' => 6, 'constraintTitle' => 'Team Collaboration', 'description' => 'In Progress', 'owner' => 'Maricar', 'actions' => 'Scheduled', 'status' => 'Tracking'],
                ['id' => 7, 'constraintTitle' => 'Market Research', 'description' => 'Completed', 'owner' => 'Maricar', 'actions' => 'Pending', 'status' => 'Tracking'],
            ]),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
