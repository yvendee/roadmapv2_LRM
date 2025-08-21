<?php
// app/Docs/L_Tools/C_BigIdeasDoc.php

namespace App\Docs\L_Tools;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/tools/big-ideas",
 *     summary="Get list of Big Ideas submitted for an organization",
 *     tags={"Tools"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve big ideas for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of big ideas with their details",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="date", type="string", format="date", example="2025-04-02"),
 *                 @OA\Property(property="who", type="string", example="Kayven"),
 *                 @OA\Property(property="description", type="string", example="Systematize Coaching Framework (now called Momentum OS)."),
 *                 @OA\Property(property="impact", type="string", example="High"),
 *                 @OA\Property(property="when", type="string", format="date", example="2025-04-02"),
 *                 @OA\Property(property="evaluator", type="string", example="Team A"),
 *                 @OA\Property(property="comments", type="string", example="Initial team feedback looks promising.")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class C_BigIdeasDoc {}
