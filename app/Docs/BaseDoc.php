<?php
// app\Docs\BaseDoc.php

// php artisan l5-swagger:generate
// http://localhost/api/documentation

namespace App\Docs;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Momentum Hub API",
 *     version="1.0.0",
 *     description="General API documentation for the Laravel backend."
 * )
 */
class BaseDoc {}
