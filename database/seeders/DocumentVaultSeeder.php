<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\DocumentVault;

class DocumentVaultSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Chuck Gulledge Advisors, LLC' => [
                [
                    'id' => 1,
                    'projectName' => 'Momentum OS',
                    'date' => '2025-03-28',
                    'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
                    'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
                ],
                [
                    'id' => 2,
                    'projectName' => 'Client Delivery System',
                    'date' => '2025-03-29',
                    'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
                    'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
                ],
                [
                    'id' => 3,
                    'projectName' => 'Momentum Hub',
                    'date' => '2025-03-30',
                    'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
                    'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
                ],
                [
                    'id' => 4,
                    'projectName' => 'Lead Gen System',
                    'date' => '2025-03-31',
                    'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
                    'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
                ],
                [
                    'id' => 5,
                    'projectName' => '1% Genius v3',
                    'date' => '2025-04-01',
                    'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
                    'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
                    'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
                ],
            ],
        ];

        foreach ($data as $organization => $documents) {
            DocumentVault::create([
                'u_id' => Str::uuid(),
                'organizationName' => $organization,
                'documentVaultData' => $documents,
                'statusFlag' => null,
            ]);
        }
    }
}
