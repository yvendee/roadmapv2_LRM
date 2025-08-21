<?php
// app/Docs/M_DocumentVault/A_DocumentVaultListDoc.php

namespace App\Docs\M_DocumentVault;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/document-vault/list",
 *     summary="Get document list for an organization",
 *     tags={"Document Vault"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve document list for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of documents",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="projectName", type="string", example="Momentum OS"),
 *                 @OA\Property(property="date", type="string", format="date", example="2025-03-28"),
 *                 @OA\Property(property="link", type="string", format="url", example="https://drive.google.com/file/d/1OsPZ8.../view?usp=sharing"),
 *                 @OA\Property(property="viewLink", type="string", format="url", example="https://drive.google.com/file/d/1OsPZ8.../view?usp=sharing"),
 *                 @OA\Property(property="uploadLink", type="string", example="/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p"),
 *                 @OA\Property(property="pdflink", type="string", example="/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class A_DocumentVaultListDoc {}
