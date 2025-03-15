<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * تشغيل Seeders لإضافة بيانات إلى قاعدة البيانات.
     */
    public function run(): void
    {
        // استدعاء Seeder لإدخال المستخدمين
        $this->call(UsersSeeder::class);
    }
}
