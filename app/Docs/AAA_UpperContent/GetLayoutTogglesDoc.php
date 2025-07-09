<?php
// app/Docs/AAA_UpperContent/GetLayoutTogglesDoc.php

namespace App\Docs\AAA_UpperContent;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/get-layout-toggles",
 *     summary="Get Layout Toggles for Organization",
 *     tags={"Upper Content"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The name of the organization",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns toggle settings for a specific organization",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="success"),
 *             @OA\Property(
 *                 property="toggles",
 *                 type="object",
 *                 @OA\Property(property="Strategic Drivers", type="boolean", example=true),
 *                 @OA\Property(property="Foundations", type="boolean", example=false),
 *                 @OA\Property(property="3 Year Outlook", type="boolean", example=false),
 *                 @OA\Property(property="Playing to Win Strategy", type="boolean", example=true),
 *                 @OA\Property(property="Core Capabilities", type="boolean", example=true),
 *                 @OA\Property(property="4 Decisions", type="boolean", example=false),
 *                 @OA\Property(property="Constraints Tracker", type="boolean", example=false)
 *             ),
 *             @OA\Property(property="organization", type="string", example="Ironclad"),
 *             @OA\Property(property="unique_id", type="string", example="664fbb88e5f56")
 *         )
 *     )
 * )
 */
class GetLayoutTogglesDoc {}
