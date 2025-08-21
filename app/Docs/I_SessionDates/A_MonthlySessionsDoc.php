<?php
// app/Docs/I_SessionDates/A_MonthlySessionsDoc.php

namespace App\Docs\I_SessionDates;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/session-dates/monthly-sessions-tracker",
 *     summary="Get monthly session tracker data for a given organization",
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
 *         description="Monthly sessions data with date, status, and details",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/MonthlySessionItem")
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
 *     schema="MonthlySessionItem",
 *     type="object",
 *     @OA\Property(property="date", type="string", format="date", example="2025-07-01"),
 *     @OA\Property(property="status", type="string", example="done"),
 *     @OA\Property(property="details", type="string", example="Strategy alignment")
 * )
 */
class A_MonthlySessionsDoc {}
