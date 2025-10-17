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
                'coreCapabilitiesData' => [],
                'statusFlag' => null,
            ]);

            // 🆕 Four Decisions
            \App\Models\OpspFourDecision::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'fourDecisionsData' => [],
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

            // 🆕 Coaching Checklist Panel
            \App\Models\CoachingChecklistPanel::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'coachingChecklistPanelsData' => [],
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


        });
    }
}
