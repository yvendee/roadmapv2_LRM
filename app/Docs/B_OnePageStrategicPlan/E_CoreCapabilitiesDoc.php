<?php
// app/Docs/B_OnePageStrategicPlan/E_CoreCapabilitiesDoc.php

namespace App\Docs\B_OnePageStrategicPlan;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/one-page-strategic-plan/core-capabilities",
 *     summary="Get Core Capabilities for an Organization",
 *     tags={"One Page Strategic Plan"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve core capabilities data",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns core capabilities data for the specified organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="description", type="string", example="Leadership Training"),
 *                     @OA\Property(property="orig", type="string", example="✓"),
 *                     @OA\Property(property="q1", type="string", example="x"),
 *                     @OA\Property(property="q2", type="string", example="x"),
 *                     @OA\Property(property="q3", type="string", example="x"),
 *                     @OA\Property(property="q4", type="string", example="x")
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
class E_CoreCapabilitiesDoc {}
