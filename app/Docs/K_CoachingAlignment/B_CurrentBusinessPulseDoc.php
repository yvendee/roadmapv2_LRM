<?php
// app/Docs/K_CoachingAlignment/B_CurrentBusinessPulseDoc.php

namespace App\Docs\K_CoachingAlignment;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/coaching-alignment/current-business-pulse",
 *     summary="Get current business pulse categories, ratings, and notes for an organization",
 *     tags={"Coaching Alignment"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve business pulse data for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Current business pulse data by category",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(
 *                     property="category",
 *                     type="string",
 *                     example="Strategic Clarity"
 *                 ),
 *                 @OA\Property(
 *                     property="rating",
 *                     type="string",
 *                     example="3"
 *                 ),
 *                 @OA\Property(
 *                     property="notes",
 *                     type="array",
 *                     @OA\Items(type="string", example="Need clearer vision shared")
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
class B_CurrentBusinessPulseDoc {}
