<?php
// app/Docs/B_OnePageStrategicPlan/F_FourDecisionsDoc.php

namespace App\Docs\B_OnePageStrategicPlan;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/one-page-strategic-plan/four-decisions",
 *     summary="Get Four Decisions data for an Organization",
 *     tags={"One Page Strategic Plan"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve Four Decisions data",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns Four Decisions data for the specified organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="description", type="string", example="Budget Allocation"),
 *                     @OA\Property(property="orig", type="string", example="x"),
 *                     @OA\Property(property="q1", type="string", example="x"),
 *                     @OA\Property(property="q2", type="string", example="✓"),
 *                     @OA\Property(property="q3", type="string", example="x"),
 *                     @OA\Property(property="q4", type="string", example="✓")
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
class F_FourDecisionsDoc {}
