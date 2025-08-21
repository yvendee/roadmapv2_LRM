<?php
// app/Docs/L_Tools/B_VictoriesDoc.php

namespace App\Docs\L_Tools;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/tools/victories",
 *     summary="Get list of recorded victories (milestones) for an organization",
 *     tags={"Tools"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve victories for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of victories related to the organization",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="date", type="string", format="date", example="2025-04-02"),
 *                 @OA\Property(property="who", type="string", example="Kayven"),
 *                 @OA\Property(property="milestones", type="string", example="Systematize Coaching Framework (now called Momentum OS)."),
 *                 @OA\Property(property="notes", type="string", example="Notes about the achievement")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class B_VictoriesDoc {}
