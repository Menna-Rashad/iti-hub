<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
// use App\Models\User;
// use App\Models\Category;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        \App\Models\Category::create(['name' => 'General']);
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
