<?php
// app/Docs/F_CompanyTraction/A_AnnualPrioritiesDoc.php

namespace App\Docs\F_CompanyTraction;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/company-traction/annual-priorities",
 *     summary="Get annual priorities for a given organization",
 *     tags={"Company Traction"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch annual priorities for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of annual priorities with completion status",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="description", type="string", example="Systematize Coaching Framework (now called Momentum OS)."),
 *                 @OA\Property(property="status", type="string", example="100.00%")
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
