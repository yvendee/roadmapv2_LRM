<?php
// app/Docs/G_DepartmentTraction/A_AnnualPrioritiesDoc.php

namespace App\Docs\G_DepartmentTraction;

use OpenApi\Annotations as OA;
use Illuminate\Http\Request;

/**
 * @OA\Get(
 *     path="/api/v1/department-traction/annual-priorities",
 *     summary="Get department-level annual priorities for a given organization",
 *     tags={"Department Traction"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch department annual priorities for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of department annual priorities with completion status",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="description", type="string", example="Department-level initiative to enhance coaching operations."),
 *                 @OA\Property(property="status", type="string", example="90.00%")
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
