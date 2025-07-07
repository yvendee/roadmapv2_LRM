<?php

// app\Docs\CsrfTokenDoc.php

namespace App\Docs;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/csrf-token",
 *     summary="Get CSRF Token",
 *     tags={"Security"},
 *     @OA\Response(
 *         response=200,
 *         description="Returns the CSRF token",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="csrf_token",
 *                 type="string",
 *                 example="XyZ123AbC456"
 *             )
 *         )
 *     )
 * )
 */
class CsrfTokenDoc {}
