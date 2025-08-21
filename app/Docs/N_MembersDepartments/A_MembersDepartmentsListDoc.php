<?php
// app/Docs/N_MembersDepartments/A_MembersDepartmentsListDoc.php

namespace App\Docs\N_MembersDepartments;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/members-departments",
 *     summary="Get list of departments or teams for a given organization",
 *     tags={"Members & Departments"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve departments for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of departments",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Momentum OS")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized"
 *     )
 * )
 */
class A_MembersDepartmentsListDoc {}
