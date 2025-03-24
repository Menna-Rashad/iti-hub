<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
// use App\Models\User;
// use App\Models\Category;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // استدعاء Seeder لإدخال المستخدمين
        $this->call(UsersSeeder::class);
        // استدعاء Seeder لإدخال الوظائف
        $this->call(JobSeeder::class);
    }
}
