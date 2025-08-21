<?php
// app/Docs/F_CompanyTraction/B_TractionDataDoc.php

namespace App\Docs\F_CompanyTraction;

use OpenApi\Annotations as OA;
use Illuminate\Http\Request;

/**
 * @OA\Get(
 *     path="/api/v1/company-traction/traction-data",
 *     summary="Get traction data for a given organization",
 *     tags={"Company Traction"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="Organization name to fetch traction data for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Traction data grouped by quarters",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="Q1",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="who", type="string", example="Maricar"),
 *                     @OA\Property(property="collaborator", type="string", example="Maricar"),
 *                     @OA\Property(property="description", type="string", example="Build landing page"),
 *                     @OA\Property(property="progress", type="string", example="5%"),
 *                     @OA\Property(property="annualPriority", type="string", example="Develop lead generation systems"),
 *                     @OA\Property(property="dueDate", type="string", example="03-31-2025"),
 *                     @OA\Property(property="rank", type="string", example="1"),
 *                     @OA\Property(
 *                         property="comment",
 *                         type="array",
 *                         @OA\Items(
 *                             type="object",
 *                             @OA\Property(property="author", type="string", example="Maricar"),
 *                             @OA\Property(property="message", type="string", example="This is a test comment."),
 *                             @OA\Property(property="posted", type="string", example="26 June 2025")
 *                         )
 *                     )
 *                 )
 *             ),
 *             @OA\Property(property="Q2", type="array", @OA\Items(ref="#/components/schemas/TractionItem")),
 *             @OA\Property(property="Q3", type="array", @OA\Items(ref="#/components/schemas/TractionItem")),
 *             @OA\Property(property="Q4", type="array", @OA\Items(ref="#/components/schemas/TractionItem"))
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="TractionItem",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="who", type="string", example="Maricar"),
 *     @OA\Property(property="collaborator", type="string", example="Maricar"),
 *     @OA\Property(property="description", type="string", example="Build landing page"),
 *     @OA\Property(property="progress", type="string", example="5%"),
 *     @OA\Property(property="annualPriority", type="string", example="Develop lead generation systems"),
 *     @OA\Property(property="dueDate", type="string", example="03-31-2025"),
 *     @OA\Property(property="rank", type="string", example="1"),
 *     @OA\Property(
 *         property="comment",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             @OA\Property(property="author", type="string", example="Maricar"),
 *             @OA\Property(property="message", type="string", example="This is a test comment."),
 *             @OA\Property(property="posted", type="string", example="26 June 2025")
 *         )
 *     )
 * )
 */
class B_TractionDataDoc {}
