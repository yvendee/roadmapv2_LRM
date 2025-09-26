<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MessagingLeftConversationsSeeder extends Seeder
{
    public function run()
    {
        $mockData = [
            'Kayven Delatado' => [
                ['id' => 1, 'sender' => 'Jamie Lee', 'uid' => 'UID-101'],
                ['id' => 2, 'sender' => 'Maricar Aquino', 'uid' => 'UID-102'],
                ['id' => 3, 'sender' => 'John Santos', 'uid' => 'UID-103'],
                ['id' => 4, 'sender' => 'Angela Reyes', 'uid' => 'UID-104'],
                ['id' => 5, 'sender' => 'Mark Villanueva', 'uid' => 'UID-105'],
            ],
            'Jamie Lee' => [
                ['id' => 1, 'sender' => 'Kayven Delatado', 'uid' => 'UID-201'],
                ['id' => 2, 'sender' => 'Mark Villanueva', 'uid' => 'UID-202'],
                ['id' => 3, 'sender' => 'Angela Reyes', 'uid' => 'UID-203'],
                ['id' => 4, 'sender' => 'Maricar Aquino', 'uid' => 'UID-204'],
                ['id' => 5, 'sender' => 'John Santos', 'uid' => 'UID-205'],
            ],
            'Maricar Aquino' => [
                ['id' => 1, 'sender' => 'Kayven Delatado', 'uid' => 'UID-301'],
                ['id' => 2, 'sender' => 'Jamie Lee', 'uid' => 'UID-302'],
            ],
        ];

        foreach ($mockData as $fullName => $conversationData) {
            DB::table('messaging_left_conversations')->insert([
                'u_id' => Str::uuid(),
                'fullName' => $fullName,
                'leftConversationsData' => json_encode($conversationData), // Store as JSON
                'statusFlag' => null, // You can assign a default or dynamic value
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
