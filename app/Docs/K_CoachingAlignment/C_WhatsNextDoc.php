<?php
// app/Docs/K_CoachingAlignment/C_WhatsNextDoc.php

namespace App\Docs\K_CoachingAlignment;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/coaching-alignment/whats-next",
 *     summary="Get upcoming coaching alignment action items for an organization",
 *     tags={"Coaching Alignment"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve upcoming action items for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Upcoming coaching alignment action items",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="whatsNextItems",
 *                 type="array",
 *                 @OA\Items(type="string", example="Schedule leadership retreat")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class C_WhatsNextDoc {}
