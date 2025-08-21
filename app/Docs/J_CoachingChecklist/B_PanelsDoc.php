<?php
// app/Docs/J_CoachingChecklist/B_PanelsDoc.php

namespace App\Docs\J_CoachingChecklist;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/coaching-checklist/panels",
 *     summary="Get coaching checklist panels for a given organization",
 *     tags={"Coaching Checklist"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization to retrieve coaching checklist panels for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of coaching checklist panels",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/ChecklistPanel")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="ChecklistPanel",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Client Onboarding"),
 *     @OA\Property(property="icon", type="string", example="faHandshake"),
 *     @OA\Property(property="expanded", type="boolean", example=false),
 *     @OA\Property(
 *         property="items",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/ChecklistItem")
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="ChecklistItem",
 *     type="object",
 *     @OA\Property(property="id", type="string", example="1a"),
 *     @OA\Property(property="text", type="string", example="Welcome call completed"),
 *     @OA\Property(property="completed", type="boolean", example=true)
 * )
 */
class B_PanelsDoc {}
