<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\ToolsProductEvaluationGrid;

class ToolsProductEvaluationGridsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'id' => 1,
                    'productName' => 'Momentum OS',
                    'description' => 'Systematize Coaching Framework (now called Momentum OS).',
                    'pricingPower' => 'High',
                    'acceleratingGrowth' => 'Yes',
                    'profitMargin' => '60%',
                    'marketShare' => '10%',
                    'customerSatisfaction' => 'Excellent',
                    'innovationPotential' => 'High',
                    'operationEfficiency' => 'Strong',
                    'lifeCycleStage' => 'Growth',
                ],
                [
                    'id' => 2,
                    'productName' => 'Client Delivery System',
                    'description' => 'Systematize Client Delivery.',
                    'pricingPower' => 'Medium',
                    'acceleratingGrowth' => 'Yes',
                    'profitMargin' => '55%',
                    'marketShare' => '8%',
                    'customerSatisfaction' => 'Good',
                    'innovationPotential' => 'Medium',
                    'operationEfficiency' => 'Moderate',
                    'lifeCycleStage' => 'Growth',
                ],
                [
                    'id' => 3,
                    'productName' => 'Momentum Hub',
                    'description' => 'Online Portal for Clients (Beta completed with eDoc by March 31).',
                    'pricingPower' => 'High',
                    'acceleratingGrowth' => 'No',
                    'profitMargin' => '0%',
                    'marketShare' => '0%',
                    'customerSatisfaction' => 'Pending',
                    'innovationPotential' => 'High',
                    'operationEfficiency' => 'Early',
                    'lifeCycleStage' => 'Introduction',
                ],
                [
                    'id' => 4,
                    'productName' => 'Lead Gen System',
                    'description' => 'Develop lead generation systems.',
                    'pricingPower' => 'Medium',
                    'acceleratingGrowth' => 'Yes',
                    'profitMargin' => '50%',
                    'marketShare' => '5%',
                    'customerSatisfaction' => 'Average',
                    'innovationPotential' => 'Medium',
                    'operationEfficiency' => 'Developing',
                    'lifeCycleStage' => 'Development',
                ],
                [
                    'id' => 5,
                    'productName' => '1% Genius v3',
                    'description' => '1% Genius Version 3 Development.',
                    'pricingPower' => 'High',
                    'acceleratingGrowth' => 'Yes',
                    'profitMargin' => '65%',
                    'marketShare' => '12%',
                    'customerSatisfaction' => 'Excellent',
                    'innovationPotential' => 'Very High',
                    'operationEfficiency' => 'Optimized',
                    'lifeCycleStage' => 'Maturity',
                ],
            ],
        ];

        foreach ($data as $org => $products) {
            ToolsProductEvaluationGrid::create([
                'u_id' => Str::uuid(),
                'organizationName' => $org,
                'toolsProductEvaluationGridsData' => $products,
                'statusFlag' => null,
            ]);
        }
    }
}
