<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'General', 'post_count' => 0],
            ['name' => 'Angular', 'post_count' => 0],
            ['name' => 'Feedback', 'post_count' => 0],
            ['name' => 'Laravel', 'post_count' => 0],
            ['name' => 'Web Development', 'post_count' => 0],
            ['name' => 'Mobile Development', 'post_count' => 0],
            ['name' => 'Data Science', 'post_count' => 0],
            ['name' => 'DevOps', 'post_count' => 0],
            ['name' => 'UI/UX Design', 'post_count' => 0],
        ];

        foreach ($categories as $category) {
            // Check if category already exists
            $categoryRecord = Category::firstOrCreate(
                ['name' => $category['name']], // Search by name
                [
                    'post_count' => $category['post_count'], // Default value for new categories
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            if ($categoryRecord->wasRecentlyCreated) {
                Log::info("Created new category: {$category['name']}");
            } else {
                Log::info("Category {$category['name']} already exists, skipping creation.");
            }
        }
    }
}