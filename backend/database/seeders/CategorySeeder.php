<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'General'],
            ['name' => 'Angular'],
            ['name' => 'Feedback'],
            ['name' => 'Laravel'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
