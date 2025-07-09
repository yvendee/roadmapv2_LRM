<?php
// app/Docs/B_OnePageStrategicPlan/B_FoundationsDoc.php

namespace App\Docs\B_OnePageStrategicPlan;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/one-page-strategic-plan/foundations",
 *     summary="Get One Page Strategic Plan - Foundations",
 *     tags={"One Page Strategic Plan"},
 *     @OA\Response(
 *         response=200,
 *         description="Returns foundational elements of the One Page Strategic Plan",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="title", type="string", example="Our Aspiration"),
 *                 @OA\Property(property="content", type="string", example="To be renowned as the premier coaching organization that transforms how companies achieve their optimal exits.")
 *             )
 *         )
 *     )
 * )
 */
class B_FoundationsDoc {}
