<?php
// app/Docs/I_SessionDates/B_QuarterlySessionsDoc.php

namespace App\Docs\I_SessionDates;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/session-dates/quarterly-sessions",
 *     summary="Retrieve quarterly session data for the specified organization",
 *     tags={"Session Dates"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch quarterly sessions for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Quarterly sessions data for the organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Chuck Gulledge Advisors, LLC",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/QuarterlySessionItem")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized"
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="QuarterlySessionItem",
 *     type="object",
 *     @OA\Property(property="status", type="string", example="Completed"),
 *     @OA\Property(property="quarter", type="string", example="Q1 2025"),
 *     @OA\Property(property="meetingDate", type="string", example="January 20, 2025"),
 *     @OA\Property(property="agenda", type="string", example="Strategic Planning & KPIs"),
 *     @OA\Property(property="recap", type="string", example="Shared Q1 goals and budget updates")
 * )
 */
class B_QuarterlySessionsDoc {}
