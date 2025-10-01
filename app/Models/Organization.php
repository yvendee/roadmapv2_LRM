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

        // Automatically create related records after organization creation
        static::created(function ($organization) {

            // // 🧩 Layout settings
            // \App\Models\OpspLayoutSetting::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'strategicDriversStatus' => 'true',
            //     'FoundationsStatus' => 'true',
            //     'threeYearOutlookStatus' => 'true',
            //     'playingToWinStatus' => 'true',
            //     'coreCapabilitiesStatus' => 'true',
            //     'fourDecisionsStatus' => 'true',
            //     'ConstraintsTrackerStatus' => 'true',
            //     'modifiedByEmail' => null,
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Strategic Drivers
            // \App\Models\OpspStrategicDriver::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'strategicDriversData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Foundations
            // \App\Models\OpspFoundation::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'foundationsData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Three Year Outlook
            // \App\Models\OpspThreeyearOutlook::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'threeyearOutlookData' => [],
            //     'statusFlag' => null,
            // ]);

            // 🆕 Playing to Win Strategy
            \App\Models\OpspPlayingtowinStrategy::create([
                'u_id' => $organization->u_id,
                'organizationName' => $organization->organizationName,
                'playingToWinStrategyData' => null,
                'statusFlag' => null,
            ]);

            // // 🆕 Core Capabilities
            // \App\Models\OpspCoreCapability::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'coreCapabilitiesData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Four Decisions
            // \App\Models\OpspFourDecision::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'fourDecisionsData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Constraints Tracker
            // \App\Models\OpspConstraintsTracker::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'constraintsTrackerData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Flywheel
            // \App\Models\Flywheel::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'fileLink' => null,
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Scoreboard: Annual Priorities
            // \App\Models\ScoreboardAnnualpriority::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'annualPrioritiesdData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Scoreboard: Company Traction Card
            // \App\Models\ScoreboardCompanyTractionCard::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'companyTractionCardData' => [],
            //     'statusFlag' => null,
            // ]);

            // // 🆕 Scoreboard: Project Progress Card
            // \App\Models\ScoreboardProjectProgressCard::create([
            //     'u_id' => $organization->u_id,
            //     'organizationName' => $organization->organizationName,
            //     'projectProgressCardData' => [],
            //     'statusFlag' => null,
            // ]);
        });
    }
}
