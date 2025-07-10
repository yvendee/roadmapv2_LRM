<?php
// app/Docs/B_OnePageStrategicPlan/C_ThreeYearOutlookDoc.php

namespace App\Docs\B_OnePageStrategicPlan;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/one-page-strategic-plan/three-year-outlook",
 *     summary="Get 3-Year Outlook for an Organization",
 *     tags={"One Page Strategic Plan"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to filter the 3-year outlook",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns 3-year revenue outlook for the specified organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="year", type="string", example="2026"),
 *                     @OA\Property(property="value", type="string", example="1.0 Revenue of $4 Million")
 *                 )
 *             )
 *         )
 *     )
 * )
 */

class C_ThreeYearOutlookDoc {}
