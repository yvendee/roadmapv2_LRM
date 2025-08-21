<?php
// app/Docs/K_CoachingAlignment/D_CoachingGoalsDoc.php

namespace App\Docs\K_CoachingAlignment;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/coaching-alignment/coaching-goals",
 *     summary="Get coaching goals for an organization",
 *     tags={"Coaching Alignment"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve coaching goals for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of coaching goals",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="coachingGoalsItems",
 *                 type="array",
 *                 @OA\Items(type="string", example="Build high-impact team")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class D_CoachingGoalsDoc {}
