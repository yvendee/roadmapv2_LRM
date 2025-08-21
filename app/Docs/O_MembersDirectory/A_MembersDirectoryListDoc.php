<?php
// app/Docs/O_MembersDirectory/A_MembersDirectoryListDoc.php

namespace App\Docs\O_MembersDirectory;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/members-directory",
 *     summary="Get list of members for a given organization",
 *     tags={"Members & Directory"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve member directory for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of members",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="fullname", type="string", example="Chuck Gulledge"),
 *                 @OA\Property(property="company", type="string", example="Chuck Gulledge Advisors, LLC"),
 *                 @OA\Property(property="email", type="string", format="email", example="chuck.gulledge@gmail.com"),
 *                 @OA\Property(property="department", type="string", example="Admin"),
 *                 @OA\Property(property="memberAccess", type="string", example="Superadmin"),
 *                 @OA\Property(property="canLogin", type="string", example="Yes")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized"
 *     )
 * )
 */
class A_MembersDirectoryListDoc {}
