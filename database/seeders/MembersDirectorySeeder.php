<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\MembersDirectory;

class MembersDirectorySeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'id' => 1,
                'fullname' => 'Maricar Aquino',
                'company' => 'Chuck Gulledge Advisors, LLC',
                'email' => 'maricar@chuckgulledge.com',
                'department' => 'Admin',
                'memberAccess' => 'Leadership',
                'canLogin' => 'Yes',
            ],
            [
                'id' => 2,
                'fullname' => 'Chuck Gulledge',
                'company' => 'Chuck Gulledge Advisors, LLC',
                'email' => 'chuck.gulledge@gmail.com',
                'department' => 'Admin',
                'memberAccess' => 'Leadership',
                'canLogin' => 'Yes',
            ],
        ];

        MembersDirectory::create([
            'u_id' => Str::uuid(),
            'organizationName' => 'Chuck Gulledge Advisors, LLC',
            'membersDirectoryData' => $members,
            'statusFlag' => null,
        ]);
    }
}
