<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AuthTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('auth')->insert([
            [
                'u_id' => Str::uuid(),
                'firstName' => 'Kay',
                'lastName' => 'Dee',
                'email' => 'yvendee18@gmail.com',
                'organization' => 'Chuck Gulledge Advisors, LLC',
                'paswordHash' => Hash::make('password123'),
                'role' => 'admin',
                'group' => 'executive',
                'position' => 'admin',
                'status' => 'active',
                'resetCode' => null,
                'expireAt' => null,
                'token' => null,
                'accessToken' => null,
                'refreshToken' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'u_id' => Str::uuid(),
                'firstName' => 'User',
                'lastName' => 'Test',
                'email' => 'uat@gmail.com',
                'organization' => 'Chuck Gulledge Advisors, LLC',
                'paswordHash' => Hash::make('q'),
                'role' => 'testuser',
                'group' => 'operations',
                'position' => 'testuser',
                'status' => 'active',
                'resetCode' => null,
                'expireAt' => null,
                'token' => null,
                'accessToken' => null,
                'refreshToken' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'u_id' => Str::uuid(),
                'firstName' => 'Maricar',
                'lastName' => 'Aquino',
                'email' => 'maricar@chuckgulledge.com',
                'organization' => 'Chuck Gulledge Advisors, LLC',
                'paswordHash' => Hash::make('Password123'),
                'role' => 'superadmin',
                'group' => 'operations',
                'position' => 'superadmin',
                'status' => 'active',
                'resetCode' => null,
                'expireAt' => null,
                'token' => null,
                'accessToken' => null,
                'refreshToken' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
