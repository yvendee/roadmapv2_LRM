<?php
// app/Docs/D_Scoreboard/A_AnnualPrioritiesDoc.php

namespace App\Docs\D_Scoreboard;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/scoreboard/annual-priorities",
 *     summary="Get Annual Priorities scoreboard data for an Organization",
 *     tags={"Scoreboard"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve Annual Priorities scoreboard",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns average score and member scores for the specified organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="average", type="number", format="float", example=64.28),
 *             @OA\Property(
 *                 property="members",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="name", type="string", example="Maricar Aquino"),
 *                     @OA\Property(property="score", type="integer", example=100)
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
class A_AnnualPrioritiesDoc {}
