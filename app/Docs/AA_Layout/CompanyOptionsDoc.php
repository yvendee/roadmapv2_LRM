<?php
// app/Docs/AA_Layout/CompanyOptionsDoc.php

namespace App\Docs\AA_Layout;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/company-options",
 *     summary="Get Company Options",
 *     tags={"App Layout"},
 *     @OA\Response(
 *         response=200,
 *         description="Returns a list of company names",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(type="string", example="Ironclad")
 *         )
 *     )
 * )
 */
class CompanyOptionsDoc {}
