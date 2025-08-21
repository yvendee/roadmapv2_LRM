<?php
// app/Docs/J_CoachingChecklist/A_ProjectProgressDoc.php

namespace App\Docs\J_CoachingChecklist;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/coaching-checklist/project-progress",
 *     summary="Get project progress and next recommended tools for a given organization",
 *     tags={"Coaching Checklist"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch project progress for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Project progress including completed items, total items, and tool recommendations",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="completedItems", type="integer", example=3),
 *             @OA\Property(property="totalItems", type="integer", example=5),
 *             @OA\Property(
 *                 property="nextRecommendedTools",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/RecommendedTool")
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
 *     schema="RecommendedTool",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="SWOT Analysis Tool")
 * )
 */
class A_ProjectProgressDoc {}
