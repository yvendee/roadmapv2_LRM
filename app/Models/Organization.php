<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Organization extends Model
{
    protected $table = 'organizations';

    protected $fillable = [
        'u_id',
        'organizationName',
        'industry',
        'size',
        'location',
        'token',
        'status',
        'owner',
    ];

    public static function boot()
    {
        parent::boot();

        // Automatically generate UUID when creating
        static::creating(function ($model) {
            $model->u_id = (string) Str::uuid();
        });

        // static::creating(function ($model) {
        //     $model->u_id = 'f5f9c6a3-f52b-410d-abf8-44f5459120c0';
        // });

        // Automatically create related records after organization creation
        static::created(function ($organization) {

            // 🧩 Layout settings
            \App\Models\OpspLayoutSetting::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'strategicDriversStatus' => 'true',
                'FoundationsStatus' => 'true',
                'threeYearOutlookStatus' => 'true',
                'playingToWinStatus' => 'true',
                'coreCapabilitiesStatus' => 'true',
                'fourDecisionsStatus' => 'true',
                'ConstraintsTrackerStatus' => 'true',
                'modifiedByEmail' => null,
                'statusFlag' => null,
            ]);

            // 🆕 Strategic Drivers
            \App\Models\OpspStrategicDriver::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'strategicDriversData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Foundations
            \App\Models\OpspFoundation::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'foundationsData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Three Year Outlook
            \App\Models\OpspThreeyearOutlook::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'threeyearOutlookData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Playing to Win Strategy
            \App\Models\OpspPlayingtowinStrategy::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'playingToWinStrategyData' => null,
                'statusFlag' => null,
            ]);


            // 🆕 Core Capabilities
            \App\Models\OpspCoreCapability::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coreCapabilitiesData' => [
                    [
                        'header1' => 'description',
                        'header2' => 'text',
                        'header3' => 'text',
                        'header4' => 'text',
                        'header5' => 'text',
                        'header6' => 'text',
                    ],
                    [
                        'description' => '-',
                        'orig' => '-',
                        'q1' => '-',
                        'q2' => '-',
                        'q3' => '-',
                        'q4' => '-',
                        'id' => 1,
                    ],
                ],
                'statusFlag' => null,
            ]);


            // 🆕 Four Decisions
            \App\Models\OpspFourDecision::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'fourDecisionsData' => [
                    [
                        'header1' => 'description',
                        'header2' => 'text',
                        'header3' => 'text',
                        'header4' => 'text',
                        'header5' => 'text',
                        'header6' => 'text',
                    ],
                    [
                        'description' => '-',
                        'orig' => '-',
                        'q1' => '-',
                        'q2' => '-',
                        'q3' => '-',
                        'q4' => '-',
                        'id' => 1,
                    ],
                ],
                'statusFlag' => null,
            ]);

            // 🆕 Constraints Tracker
            \App\Models\OpspConstraintsTracker::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'constraintsTrackerData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Flywheel
            \App\Models\Flywheel::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'fileLink' => null,
                'statusFlag' => null,
            ]);

            // 🆕 Scoreboard: Annual Priorities
            \App\Models\ScoreboardAnnualpriority::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'annualPrioritiesdData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Scoreboard: Company Traction Card
            \App\Models\ScoreboardCompanyTractionCard::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'companyTractionCardData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Scoreboard: Project Progress Card
            \App\Models\ScoreboardProjectProgressCard::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'projectProgressCardData' => [],
                'statusFlag' => null,
            ]);


            $zeroedMetrics = [
                [
                    'title' => 'Checks Processed',
                    'percent' => 0,
                    'annualGoal' => 0,
                    'current' => 0,
                    'monthlyData' => array_map(fn($month) => [
                        'month' => $month,
                        'goal' => 0,
                        'current' => 0,
                        'progress' => 0
                    ], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
                    'quarterlyData' => array_map(fn($q) => [
                        'quarter' => $q,
                        'goal' => 0,
                        'current' => 0,
                        'progress' => 0
                    ], ['Q1', 'Q2', 'Q3', 'Q4']),
                ],
                [
                    'title' => 'Number of Customers',
                    'percent' => 0,
                    'annualGoal' => 0,
                    'current' => 0,
                    'monthlyData' => array_map(fn($month) => [
                        'month' => $month,
                        'goal' => 0,
                        'current' => 0,
                        'progress' => 0
                    ], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
                    'quarterlyData' => array_map(fn($q) => [
                        'quarter' => $q,
                        'goal' => 0,
                        'current' => 0,
                        'progress' => 0
                    ], ['Q1', 'Q2', 'Q3', 'Q4']),
                ],
                [
                    'title' => 'Profit per X',
                    'percent' => 0,
                    'annualGoal' => 0,
                    'current' => 0,
                    'monthlyData' => array_map(fn($month) => [
                        'month' => $month,
                        'goal' => 0,
                        'current' => 0,
                        'progress' => 0
                    ], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
                    'quarterlyData' => array_map(fn($q) => [
                        'quarter' => $q,
                        'goal' => 0,
                        'current' => 0,
                        'progress' => 0
                    ], ['Q1', 'Q2', 'Q3', 'Q4']),
                ],
            ];

            // 🆕 GCC: Metrics
            \App\Models\GccMetric::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                // 'metricsData' => [],
                'metricsData' => $zeroedMetrics,
                'statusFlag' => null,
            ]);

            // 🆕 GCC: Revenue Growth
            \App\Models\GccRevenueGrowth::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'financialGrowthData' => [], // empty array as default
                'statusFlag' => null,
            ]);


            // 🆕 Company Traction: Annual Priorities
            \App\Models\CompanyTractionAnnualPriority::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'annualPrioritiesData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Company Traction: Company Traction
            \App\Models\CompanyTractionCompanyTraction::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'companyTractionData' => [],
                'statusFlag' => null,
            ]);

            // 🏢 Company Traction Activity Logs
            \App\Models\CompanyTractionActivityLog::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'companyTractionActivityLogsData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Department Traction: Annual Priorities
            \App\Models\DepartmentTractionAnnualPriority::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'annualPrioritiesData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Department Traction: Company Traction
            \App\Models\DepartmentTractionCompanyTraction::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'companyTractionData' => [],
                'statusFlag' => null,
            ]);

            // 🧭 Department Traction Activity Logs
            \App\Models\DepartmentTractionActivityLog::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'departmentTractionActivityLogsData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Thirteen Week Sprint
            \App\Models\ThirteenWeekSprint::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'thirteenWeekSprintData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Who What When
            \App\Models\WhoWhatWhen::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'whoWhatWhenData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Session Dates: Monthly Sessions
            \App\Models\SessionDatesMonthlySessions::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'sessionDatesMonthlySessionsData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Session Dates: Monthly Sessions Tracker
            \App\Models\SessionDatesMonthlySessionsTracker::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'sessionDatesMonthlySessionsTrackerData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Session Dates: Quarterly Sessions
            \App\Models\SessionDatesQuarterlySessions::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'sessionDatesQuarterlySessionsData' => [],
                'statusFlag' => null,
            ]);

            // // 🆕 Coaching Checklist Panel
            // \App\Models\CoachingChecklistPanel::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'coachingChecklistPanelsData' => [],
            //     'statusFlag' => null,
            // ]);

            // 🆕 Coaching Checklist Panel
            \App\Models\CoachingChecklistPanel::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coachingChecklistPanelsData' => [
                    [
                        "id" => 1,
                        "title" => "Client Onboarding",
                        "icon" => "faHandshake",
                        "expanded" => false,
                        "items" => [
                            [
                                "id" => "1a",
                                "text" => "Signed coaching agreement and payment confirmed; kickoff call scheduled",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "1b",
                                "text" => "Momentum Hub access granted and walkthrough completed",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "1c",
                                "text" => "CEO/founder shares their personal goals and 3-year business vision",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "1d",
                                "text" => "Leadership team completes 1% Genius Strengths Assessment",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "1e",
                                "text" => "Complete the Momentum Readiness Scorecard",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "1f",
                                "text" => "Define 3–5 key coaching outcomes for next 12 months",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "1g",
                                "text" => "Schedule strategic planning session and establish coaching rhythm",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                        ],
                    ],
                    [
                        "id" => 2,
                        "title" => "Personal & Leadership Readiness",
                        "icon" => "faUserTie",
                        "expanded" => false,
                        "items" => [
                            [
                                "id" => "2a",
                                "text" => "CEO/Leader defines their From → To journey",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "2b",
                                "text" => "Identify top personal constraints (e.g., time, confidence)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "2c",
                                "text" => "Introduce Leadership Discipline Model (clarity, accountability, routines)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "2d",
                                "text" => "Review 1% Genius + DISC profiles",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "2e",
                                "text" => "Begin Weekly Pulse or Daily Stand-Up Rhythm",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                        ],
                    ],
                    [
                        "id" => 3,
                        "title" => "Strategic Clarity",
                        "icon" => "faBullseye",
                        "expanded" => false,
                        "items" => [
                            [
                                "id" => "3a",
                                "text" => "Refine Core Purpose, Core Values, Brand Promise",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "3b",
                                "text" => "Define 3–5-year Strategic Drivers",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "3c",
                                "text" => "Develop BHAG, Vivid Vision, One-Phrase Strategy",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "3d",
                                "text" => "Apply Playing to Win Cascade (Where to Play / How to Win)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "3e",
                                "text" => "Identify Ideal Member/Client and Core Offerings",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "3f",
                                "text" => "Develop and align Core Capabilities",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                        ],
                    ],
                    [
                        "id" => 4,
                        "title" => "Execution Discipline",
                        "icon" => "faCheckSquare",
                        "expanded" => false,
                        "items" => [
                            [
                                "id" => "4a",
                                "text" => "Build or update One Page Strategic Plan (OPSP) in Momentum Hub",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "4b",
                                "text" => "Set 5–10 Annual Priorities with success metrics and owners",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "4c",
                                "text" => "Break into Quarterly Rocks and 13-Week Sprint Tracker",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "4d",
                                "text" => "Launch Weekly Meeting Rhythm and Monthly Pulse Reviews",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "4e",
                                "text" => "Use Constraints Tracker to eliminate friction",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "4f",
                                "text" => "Assign Accountability Coach (optional)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "4h",
                                "text" => "Track progress with live Scoreboards and Dashboards",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                        ],
                    ],
                    [
                        "id" => 5,
                        "title" => "Cash & Financial Discipline",
                        "icon" => "faMoneyBillWave",
                        "expanded" => false,
                        "items" => [
                            [
                                "id" => "5a",
                                "text" => "Build Financial Dashboard (Revenue, Margin, Payroll %, Cash)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "5b",
                                "text" => "Conduct Pricing Power Review (Red/Yellow/Green)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "5c",
                                "text" => "Track Gross Margin vs. Payroll monthly",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "5d",
                                "text" => "Forecast Recurring Revenue",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "5e",
                                "text" => "Identify and address cash constraints (AR, AP, inventory)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                        ],
                    ],
                    [
                        "id" => 6,
                        "title" => "MomentumOS Performance System",
                        "icon" => "faChartLine",
                        "expanded" => false,
                        "items" => [
                            [
                                "id" => "6a",
                                "text" => "Review and update Readiness Scorecard quarterly",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "6b",
                                "text" => "Conduct Team Health Check or CFA",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "6c",
                                "text" => "Refine Strategic Drivers & Priority Filters annually",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "6d",
                                "text" => "Utilize tools in Momentum Hub (Dashboards, Agendas, Tracker)",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                            [
                                "id" => "6e",
                                "text" => "Capture Client Wins and document ROI",
                                "completed" => false,
                                "date" => null,
                                "link" => null,
                                "uploadLink" => "/file-upload/coaching-checklist/1",
                                "pdflink" => null,
                            ],
                        ],
                    ],
                ],
                'statusFlag' => null,
            ]);


            // 🆕 Coaching Alignment: Current Focus
            \App\Models\CoachingAlignmentCurrentFocus::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coachingAlignmentCurrentFocusData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Coaching Alignment: Current Business Pulse
            \App\Models\CoachingAlignmentCurrentBusinessPulse::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coachingAlignmentCurrentBusinessPulseData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Coaching Alignment: What's Next
            \App\Models\CoachingAlignmentWhatsNext::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coachingAlignmentWhatsNextData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Coaching Alignment: Coaching Goal
            \App\Models\CoachingAlignmentCoachingGoal::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coachingAlignmentCoachingGoalsData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Tools Issue
            \App\Models\ToolsIssue::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'toolsIssuesData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Tools Victory
            \App\Models\ToolsVictory::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'toolsVictoriesData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Tools Product Evaluation Grid
            \App\Models\ToolsProductEvaluationGrid::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'toolsProductEvaluationGridsData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Tools Big Idea
            \App\Models\ToolsBigIdea::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'toolsBigIdeasData' => [],
                'statusFlag' => null,
            ]);


            // 🆕 Document Vault
            \App\Models\DocumentVault::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'documentVaultData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Members Department
            \App\Models\MembersDepartment::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'membersDepartmentsData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Members Directory
            \App\Models\MembersDirectory::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'membersDirectoryData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Admin Panel Company
            \App\Models\AdminPanelCompany::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'companiesData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Company Traction Annual Priorities Collection
            \App\Models\CompanyTractionAnnualPrioritiesCollection::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'tag' => "2025",
                'companyTractionData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Department Traction Annual Priorities Collection
            \App\Models\DepartmentTractionAnnualPrioritiesCollection::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'tag' => "2025", 
                'departmentTractionData' => [],
                'statusFlag' => null,
            ]);


            
            // 🆕 Company Traction Quarter Table Collection
            \App\Models\CompanyTractionQuarterTableCollection::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'tag' => "2025",
                'companyTractionData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Department Traction Quarter Table Collection
            \App\Models\DepartmentTractionQuarterTableCollection::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'tag' => "2025", 
                'departmentTractionData' => [],
                'statusFlag' => null,
            ]);

        });
    }
}
