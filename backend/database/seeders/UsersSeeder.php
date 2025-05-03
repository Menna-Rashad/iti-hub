<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'name' => 'Ahmed Salah',
                'email' => 'ahmed@example.com',
                'password' => bcrypt('password'),
                'bio' => 'مبرمج متخصص في الذكاء الاصطناعي',
                'github' => 'https://github.com/ahmedsalah',
                'linkedin' => 'https://linkedin.com/in/ahmedsalah',
                'national_id' => '11111111111111',
                'profile_picture' => 'profile1.jpg',
                'role' => 'student',
                'is_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sara Mohamed',
                'email' => 'sara@example.com',
                'password' => bcrypt('password'),
                'bio' => 'مطور ويب متخصص في React',
                'github' => 'https://github.com/saramohamed',
                'linkedin' => 'https://linkedin.com/in/saramohamed',
                'national_id' => '22222222222222',
                'profile_picture' => 'profile2.jpg',
                'role' => 'graduate',
                'is_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ali Hassan',
                'email' => 'ali@example.com',
                'password' => bcrypt('password'),
                'bio' => 'خبير في أمن المعلومات واختبار الاختراق',
                'github' => 'https://github.com/alihassan',
                'linkedin' => 'https://linkedin.com/in/alihassan',
                'national_id' => '33333333333333',
                'profile_picture' => 'profile3.jpg',
                'role' => 'mentor',
                'is_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mona Tarek',
                'email' => 'mona@example.com',
                'password' => bcrypt('password'),
                'bio' => 'إدارية مسؤولة عن النظام',
                'github' => 'https://github.com/monatarek',
                'linkedin' => 'https://linkedin.com/in/monatarek',
                'national_id' => '44444444444444',
                'profile_picture' => 'profile4.jpg',
                'role' => 'admin',
                'is_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            // التحقق إذا كان الإيميل موجود بالفعل
            if (!DB::table('users')->where('email', $user['email'])->exists()) {
                DB::table('users')->insert($user);
            } else {
                // تحديث بيانات المستخدم لو موجود
                DB::table('users')
                    ->where('email', $user['email'])
                    ->update([
                        'name' => $user['name'],
                        'password' => $user['password'],
                        'bio' => $user['bio'],
                        'github' => $user['github'],
                        'linkedin' => $user['linkedin'],
                        'national_id' => $user['national_id'],
                        'profile_picture' => $user['profile_picture'],
                        'role' => $user['role'],
                        'is_verified' => $user['is_verified'],
                        'updated_at' => now(),
                    ]);
            }
        }
    }
}