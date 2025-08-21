<?php
// app/Docs/E_GrowthCommandCenter/A_MetricsDoc.php

namespace App\Docs\E_GrowthCommandCenter;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/growth-command-center/metrics",
 *     summary="Get Growth Command Center metrics for an Organization",
 *     tags={"Growth Command Center"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve growth metrics",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns annual metric progress data for an organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="title", type="string", example="Checks Processed"),
 *                     @OA\Property(property="percent", type="integer", example=30),
 *                     @OA\Property(property="annualGoal", type="integer", example=20000),
 *                     @OA\Property(property="current", type="integer", example=18888),
 *                     @OA\Property(
 *                         property="monthlyData",
 *                         type="array",
 *                         @OA\Items(
 *                             @OA\Property(property="month", type="string", example="Jan"),
 *                             @OA\Property(property="goal", type="integer", example=1500),
 *                             @OA\Property(property="current", type="integer", example=1300),
 *                             @OA\Property(property="progress", type="integer", example=87)
 *                         )
 *                     ),
 *                     @OA\Property(
 *                         property="quarterlyData",
 *                         type="array",
 *                         @OA\Items(
 *                             @OA\Property(property="quarter", type="string", example="Q1"),
 *                             @OA\Property(property="goal", type="integer", example=4800),
 *                             @OA\Property(property="current", type="integer", example=5000),
 *                             @OA\Property(property="progress", type="integer", example=104)
 *                         )
 *                     )
 *                 )
 *             )
 *         )
 *     )
 * )
 */
class A_MetricsDoc {}
