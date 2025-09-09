<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ThirteenWeekSprintSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'week' => 1,
                'keyFocus' => ['hello ', 'hello ', ' ', ' ', ' '],
                'topTasks' => ['hello ', 'hello ', 'hello '],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 2,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 3,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 4,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 5,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 6,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 7,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 8,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 9,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 10,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 11,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 12,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
            [
                'week' => 13,
                'keyFocus' => [' ', ' ', ' ', ' ', ' '],
                'topTasks' => ['-', '-', '-'],
                'progress' => ['0%', '0%', '0%', '0%', '0%'],
                'blockers' => [' ', ' ', ' ', ' ', ' '],
                'coachNotes' => ' ',
            ],
        ];
        

        DB::table('thirteen_week_sprint')->insert([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'thirteenWeekSprintData' => json_encode($data),
            'statusFlag' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
