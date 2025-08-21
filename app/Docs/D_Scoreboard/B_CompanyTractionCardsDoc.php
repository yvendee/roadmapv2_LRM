<?php
// app/Docs/D_Scoreboard/B_CompanyTractionCardsDoc.php

namespace App\Docs\D_Scoreboard;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/scoreboard/company-traction-cards",
 *     summary="Get Company Traction Cards data for an Organization",
 *     tags={"Scoreboard"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve traction card percentages",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns quarterly traction card percentages for the specified organization",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="label", type="string", example="Q1"),
 *                 @OA\Property(property="percent", type="integer", example=100)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class B_CompanyTractionCardsDoc {}
