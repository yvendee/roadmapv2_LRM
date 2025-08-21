<?php
// app/Docs/D_Scoreboard/C_ProjectProgressDoc.php

namespace App\Docs\D_Scoreboard;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/scoreboard/project-progress",
 *     summary="Get Project Progress data for an Organization",
 *     tags={"Scoreboard"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to retrieve project progress",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns number of completed and total projects for the specified organization",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="completed", type="integer", example=10),
 *             @OA\Property(property="total", type="integer", example=36)
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class C_ProjectProgressDoc {}
