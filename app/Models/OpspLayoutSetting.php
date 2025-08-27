<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpspLayoutSetting extends Model
{
    protected $table = 'opsp_layout_settings';

    protected $fillable = [
        'u_id',
        'organizationName',
        'strategicDriversStatus',
        'FoundationsStatus',
        'threeYearOutlookStatus',
        'playingToWinStatus',
        'coreCapabilitiesStatus',
        'fourDecisionsStatus',
        'ConstraintsTrackerStatus',
        'modifiedByEmail',
        'statusFlag',
    ];
}
