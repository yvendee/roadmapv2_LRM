<?php

namespace App\Docs;

use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/login",
 *     summary="Login",
 *     tags={"Authentication"},
 *     @OA\Parameter(
 *         name="X-CSRF-TOKEN",
 *         in="header",
 *         required=true,
 *         description="CSRF token (retrieved from /api/csrf-token)",
 *         @OA\Schema(type="string", example="eyJpdiI6Ij...")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email", "password"},
 *             @OA\Property(property="email", type="string", example="kay@gmail.com"),
 *             @OA\Property(property="password", type="string", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="success"),
 *             @OA\Property(property="session_id", type="string", example="a1b2c3d4e5f6g7h8"),
 *             @OA\Property(
 *                 property="user",
 *                 type="object",
 *                 @OA\Property(property="email", type="string", example="kay@gmail.com"),
 *                 @OA\Property(property="role", type="string", example="admin"),
 *                 @OA\Property(property="group", type="string", example="executive")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid credentials",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="error"),
 *             @OA\Property(property="message", type="string", example="Invalid credentials")
 *         )
 *     )
 * )
 */
class LoginDoc {}
