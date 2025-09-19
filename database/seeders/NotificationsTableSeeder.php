<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use Illuminate\Support\Str;

class NotificationsTableSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Maricar Aquino' => [
                ['message' => "Welcome back, Maricar!", 'notification_status' => 'unread'],
                ['message' => "Strategy session scheduled at 3 PM.", 'notification_status' => 'unread'],
            ],
            'Chuck Gulledge' => [
                ['message' => "You have a new coaching request.", 'notification_status' => 'unread'],
                ['message' => "Reminder: Leadership webinar at 2 PM.", 'notification_status' => 'unread'],
            ],
            'Kayven Delatado' => [
                ['message' => "Your password will expire soon.", 'notification_status' => 'unread'],
                ['message' => "Team update: Weekly review posted.", 'notification_status' => 'unread'],
            ],
            'UAT Test' => [
                ['message' => "Report submitted successfully.", 'notification_status' => 'unread'],
                ['message' => "Don’t forget the meeting notes.", 'notification_status' => 'unread'],
            ],
            'Jamie Lee' => [
                ['message' => "Performance review scheduled.", 'notification_status' => 'unread'],
                ['message' => "New announcement: Office hours updated.", 'notification_status' => 'unread'],
            ],
        ];

        foreach ($data as $userName => $notifications) {
            Notification::create([
                'u_id' => Str::uuid(),
                'userName' => $userName,
                'notificationsData' => $notifications,
                'statusFlag' => null, // optional
            ]);
        }
    }
}
