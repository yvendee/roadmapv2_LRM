<?php
// app/Docs/B_OnePageStrategicPlan/A_StrategicDriversDoc.php

namespace App\Docs\B_OnePageStrategicPlan;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/one-page-strategic-plan/strategic-drivers",
 *     summary="Get Strategic Drivers for an Organization",
 *     tags={"One Page Strategic Plan"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to filter strategic drivers",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns strategic drivers list for the specified organization",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="title", type="string", example="Solution Innovation"),
 *                 @OA\Property(property="description", type="string", example="Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise."),
 *                 @OA\Property(property="kpi", type="string", example="Launch 2 scalable products"),
 *                 @OA\Property(property="status", type="string", example="Tracking")
 *             )
 *         )
 *     )
 * )
 */

class A_StrategicDriversDoc {}
