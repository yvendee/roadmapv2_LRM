<?php
// app/Docs/I_SessionDates/C_MonthlySessionsDoc.php

namespace App\Docs\I_SessionDates;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/session-dates/monthly-sessions",
 *     summary="Retrieve monthly session data for a specific organization",
 *     tags={"Session Dates"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch monthly sessions for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Monthly session records with status, agenda, and recap",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/MonthlySessionRecord")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="MonthlySessionRecord",
 *     type="object",
 *     @OA\Property(property="status", type="string", example="Done"),
 *     @OA\Property(property="month", type="string", example="January"),
 *     @OA\Property(property="date", type="string", format="date", example="2025-01-10"),
 *     @OA\Property(property="agenda", type="string", example="Review January goals and targets"),
 *     @OA\Property(property="recap", type="string", example="All targets met. Positive team performance.")
 * )
 */
class C_MonthlySessionsDoc {}
