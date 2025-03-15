<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * تشغيل Seeder لإضافة بيانات افتراضية.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Ahmed Salah',
                'email' => 'ahmed@example.com',
                'password' => Hash::make('password123'), // تشفير كلمة المرور
                'role' => 'student',
                'profile_picture' => 'profile1.jpg',
                'bio' => 'مبرمج متخصص في الذكاء الاصطناعي',
                'linkedin' => 'https://linkedin.com/in/ahmedsalah',
                'github' => 'https://github.com/ahmedsalah',
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sara Mohamed',
                'email' => 'sara@example.com',
                'password' => Hash::make('password123'),
                'role' => 'graduate',
                'profile_picture' => 'profile2.jpg',
                'bio' => 'مطور ويب متخصص في React',
                'linkedin' => 'https://linkedin.com/in/saramohamed',
                'github' => 'https://github.com/saramohamed',
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ali Hassan',
                'email' => 'ali@example.com',
                'password' => Hash::make('password123'),
                'role' => 'mentor',
                'profile_picture' => 'profile3.jpg',
                'bio' => 'خبير في أمن المعلومات واختبار الاختراق',
                'linkedin' => 'https://linkedin.com/in/alihassan',
                'github' => 'https://github.com/alihassan',
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mona Tarek',
                'email' => 'mona@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'profile_picture' => 'profile4.jpg',
                'bio' => 'إدارية مسؤولة عن النظام',
                'linkedin' => 'https://linkedin.com/in/monatarek',
                'github' => 'https://github.com/monatarek',
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
