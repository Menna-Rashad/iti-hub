<?php

namespace Database\Factories;

use App\Models\ForumPost;
use Illuminate\Database\Eloquent\Factories\Factory;

class ForumPostFactory extends Factory
{
    protected $model = ForumPost::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraph(3),
            'user_id' => \App\Models\User::factory(), 
            'store_category_id' => null,
            'media' => null,
            'is_pushed' => true,
        ];
    }
}
