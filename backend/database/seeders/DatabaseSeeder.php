<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * تشغيل Seeders لإضافة بيانات إلى قاعدة البيانات.
     */
    public function run()
    {
        \App\Models\Category::create(['name' => 'General']);
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
