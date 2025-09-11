<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoachingChecklistPanel;

class CoachingChecklistPanelSeeder extends Seeder
{
    public function run(): void
    {
        $commonLink = 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing';
        $uploadLink = '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9';

        $data = [
            [
                'u_id' => 1,
                'organizationName' => 'Chuck Gulledge Advisors, LLC',
                'coachingChecklistPanelsData' => [
                    [
                        'id' => 1,
                        'title' => 'Client Onboarding',
                        'icon' => 'faHandshake',
                        'expanded' => false,
                        'items' => [
                            [
                                'id' => '1a',
                                'text' => 'Welcome call completed',
                                'completed' => true,
                                'date' => '2025-03-28',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                            [
                                'id' => '1b',
                                'text' => 'Onboarding documents submitted',
                                'completed' => false,
                                'date' => '',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                        ],
                    ],
                    [
                        'id' => 2,
                        'title' => 'Personal & Leadership Readiness',
                        'icon' => 'faUserTie',
                        'expanded' => false,
                        'items' => [
                            [
                                'id' => '2a',
                                'text' => 'Personal goals aligned',
                                'completed' => true,
                                'date' => '2025-03-29',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                            [
                                'id' => '2b',
                                'text' => 'Leadership team commitment',
                                'completed' => false,
                                'date' => '',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                        ],
                    ],
                    [
                        'id' => 3,
                        'title' => 'Strategic Clarity',
                        'icon' => 'faBullseye',
                        'expanded' => false,
                        'items' => [
                            [
                                'id' => '3a',
                                'text' => 'Vision and mission reviewed',
                                'completed' => true,
                                'date' => '2025-03-30',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                            [
                                'id' => '3b',
                                'text' => 'Key strategic drivers defined',
                                'completed' => false,
                                'date' => '',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                        ],
                    ],
                    [
                        'id' => 4,
                        'title' => 'Execution Discipline',
                        'icon' => 'faCheckSquare',
                        'expanded' => false,
                        'items' => [
                            [
                                'id' => '4a',
                                'text' => 'Quarterly goals set',
                                'completed' => false,
                                'date' => '',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                            [
                                'id' => '4b',
                                'text' => 'Weekly check-ins scheduled',
                                'completed' => true,
                                'date' => '2025-03-31',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                        ],
                    ],
                    [
                        'id' => 5,
                        'title' => 'Cash & Financial Discipline',
                        'icon' => 'faMoneyBillWave',
                        'expanded' => false,
                        'items' => [
                            [
                                'id' => '5a',
                                'text' => 'Cash flow projection ready',
                                'completed' => false,
                                'date' => '',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                            [
                                'id' => '5b',
                                'text' => 'Budget aligned to goals',
                                'completed' => true,
                                'date' => '2025-04-01',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                        ],
                    ],
                    [
                        'id' => 6,
                        'title' => 'MomentumOS Performance System',
                        'icon' => 'faChartLine',
                        'expanded' => false,
                        'items' => [
                            [
                                'id' => '6a',
                                'text' => 'MomentumOS dashboard set up',
                                'completed' => true,
                                'date' => '2025-04-02',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                            [
                                'id' => '6b',
                                'text' => 'Team trained to use system',
                                'completed' => false,
                                'date' => '',
                                'link' => $commonLink,
                                'uploadLink' => $uploadLink,
                                'pdflink' => '',
                            ],
                        ],
                    ],
                ],

                'statusFlag' => null,
            ],
        ];

        foreach ($data as $entry) {
            CoachingChecklistPanel::create($entry);
        }
    }
}
