<?php
// app/Docs/K_CoachingAlignment/A_CurrentFocusDoc.php

namespace App\Docs\K_CoachingAlignment;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/coaching-alignment/current-focus",
 *     summary="Get current coaching alignment focus items for an organization",
 *     tags={"Coaching Alignment"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve focus items for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Current coaching alignment focus items",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="focusItems",
 *                 type="array",
 *                 @OA\Items(type="string", example="Enhance leadership training")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class A_CurrentFocusDoc {}
