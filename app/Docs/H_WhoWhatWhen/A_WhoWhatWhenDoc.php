<?php
// app/Docs/H_WhoWhatWhen/A_WhoWhatWhenDoc.php

namespace App\Docs\H_WhoWhatWhen;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/who-what-when",
 *     summary="Get who, what, and when tasks for a given organization",
 *     tags={"Who What When"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch who-what-when data for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of who-what-when tasks with status and comments",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/WhoWhatWhenItem")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="WhoWhatWhenItem",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="date", type="string", format="date", example="2025-03-31"),
 *     @OA\Property(property="who", type="string", example="Maricar"),
 *     @OA\Property(property="what", type="string", example="Systematize Coaching Framework (now called Momentum OS)."),
 *     @OA\Property(property="deadline", type="string", format="date", example="2025-03-31"),
 *     @OA\Property(property="comments", type="string", example="approved"),
 *     @OA\Property(property="status", type="string", example="100.00%")
 * )
 */
class A_WhoWhatWhenDoc {}
