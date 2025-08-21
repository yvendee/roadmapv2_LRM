<?php
// app/Docs/L_Tools/D_ProductEvaluationGridDoc.php

namespace App\Docs\L_Tools;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/tools/product-evaluation-grid",
 *     summary="Get product evaluation grid data for an organization",
 *     tags={"Tools"},
 *     @OA\Parameter(
 *         name="organization",
 *         in="query",
 *         required=true,
 *         description="The organization name to retrieve product evaluations for",
 *         @OA\Schema(type="string", example="Chuck Gulledge Advisors, LLC")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of product evaluations",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="productName", type="string", example="Momentum OS"),
 *                 @OA\Property(property="description", type="string", example="Systematize Coaching Framework (now called Momentum OS)."),
 *                 @OA\Property(property="pricingPower", type="string", example="High"),
 *                 @OA\Property(property="acceleratingGrowth", type="string", example="Yes"),
 *                 @OA\Property(property="profitMargin", type="string", example="60%"),
 *                 @OA\Property(property="marketShare", type="string", example="10%"),
 *                 @OA\Property(property="customerSatisfaction", type="string", example="Excellent"),
 *                 @OA\Property(property="innovationPotential", type="string", example="High"),
 *                 @OA\Property(property="operationEfficiency", type="string", example="Strong"),
 *                 @OA\Property(property="lifeCycleStage", type="string", example="Growth")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized access"
 *     )
 * )
 */
class D_ProductEvaluationGridDoc {}
