<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MessagingMessageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('messaging_messages')->insert([
            'u_id' => Str::uuid(),
            'fullName' => 'Maricar Aquino',
            'messagesData' => json_encode([
                'Maricar Aquino' => [
                    'Kayven Delatado' => [
                        [
                            'id' => 1,
                            'sender' => 'Maricar Aquino',
                            'receipt' => 'Kayven Delatado',
                            'content' => 'Hey, just checking in on the latest update.',
                            'datetime' => '2025-08-13 09:00 AM',
                        ],
                        [
                            'id' => 2,
                            'sender' => 'Kayven Delatado',
                            'receipt' => 'Maricar Aquino',
                            'content' => 'All good on my side, thanks for following up!',
                            'datetime' => '2025-08-13 09:02 AM',
                        ],
                        [
                            'id' => 3,
                            'sender' => 'Maricar Aquino',
                            'receipt' => 'Kayven Delatado',
                            'content' => 'Great to hear! Let’s sync later this afternoon.',
                            'datetime' => '2025-08-13 09:05 AM',
                        ],
                        [
                            'id' => 4,
                            'sender' => 'Kayven Delatado',
                            'receipt' => 'Maricar Aquino',
                            'content' => 'Sure thing, I’ll be free after 2 PM.',
                            'datetime' => '2025-08-13 09:06 AM',
                        ],
                        [
                            'id' => 5,
                            'sender' => 'Maricar Aquino',
                            'receipt' => 'Kayven Delatado',
                            'content' => 'Perfect, I’ll send a calendar invite.',
                            'datetime' => '2025-08-13 09:08 AM',
                        ],
                    ],
                ],
            ]),
            'statusFlag' => null, // statusFlag can be null
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
