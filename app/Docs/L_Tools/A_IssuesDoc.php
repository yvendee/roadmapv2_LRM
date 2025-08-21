<?php
// app/Docs/L_Tools/A_IssuesDoc.php

namespace App\Docs\L_Tools;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/tools/issues",
 *     summary="Get list of issues for an organization",
 *     tags={"Tools"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve issues for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of issues related to the organization",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="issueName", type="string", example="System Issue 1"),
 *                 @OA\Property(property="description", type="string", example="Systematize Coaching Framework"),
 *                 @OA\Property(property="status", type="string", example="100.00%"),
 *                 @OA\Property(property="dateLogged", type="string", format="date", example="2025-03-31"),
 *                 @OA\Property(property="who", type="string", example="Kayven"),
 *                 @OA\Property(property="resolution", type="string", example="resolution here"),
 *                 @OA\Property(property="dateResolved", type="string", format="date", example="2025-04-02")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class A_IssuesDoc {}
