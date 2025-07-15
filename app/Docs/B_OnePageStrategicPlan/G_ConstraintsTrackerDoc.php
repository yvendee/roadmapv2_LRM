<?php
// app/Docs/B_OnePageStrategicPlan/G_ConstraintsTrackerDoc.php

namespace App\Docs\B_OnePageStrategicPlan;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/one-page-strategic-plan/constraints-tracker",
 *     summary="Get Constraints Tracker data for an Organization",
 *     tags={"One Page Strategic Plan"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve Constraints Tracker data",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns Constraints Tracker data for the specified organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="constraintTitle", type="string", example="Leadership Training"),
 *                     @OA\Property(property="description", type="string", example="Pending"),
 *                     @OA\Property(property="owner", type="string", example="John Doe"),
 *                     @OA\Property(property="actions", type="string", example="In Progress"),
 *                     @OA\Property(property="status", type="string", example="Not Started")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class G_ConstraintsTrackerDoc {}
