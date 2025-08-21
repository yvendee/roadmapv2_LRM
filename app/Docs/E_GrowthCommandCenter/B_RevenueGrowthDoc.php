<?php
// app/Docs/E_GrowthCommandCenter/B_RevenueGrowthDoc.php

namespace App\Docs\E_GrowthCommandCenter;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/growth-command-center/revenue-growth",
 *     summary="Get revenue and COGS growth by year for an organization",
 *     tags={"Growth Command Center"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve revenue and COGS growth data",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns year-wise revenue and COGS growth",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="year", type="string", example="2024"),
 *                 @OA\Property(property="revenueGrowth", type="number", format="float", example=12),
 *                 @OA\Property(property="cogsGrowth", type="number", format="float", example=10)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class B_RevenueGrowthDoc {}
