<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumPost;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PostSeeder extends Seeder
{
    public function run()
    {
        $users = DB::table('users')->pluck('id')->all();
        $categoriesIds = Category::pluck('id')->all();

        if (empty($users) || empty($categoriesIds)) {
            Log::error('No users or categories found for seeding posts.');
            return;
        }

        for ($i = 1; $i <= 7; $i++) {
            try {
                $post = ForumPost::create([
                    'title' => "Post Title {$i}",
                    'content' => "This is the content for post number {$i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    'user_id' => $users[array_rand($users)],
                    'category_id' => $categoriesIds[array_rand($categoriesIds)],
                    'upvotes' => rand(0, 50),
                    'downvotes' => rand(0, 10),
                    'media' => json_encode(['image' . $i . '.jpg']),
                    'tags' => json_encode(['tag' . $i]),
                    'created_at' => now()->subDays(rand(0, 30)),
                    'updated_at' => now(),
                ]);

                $category = Category::find($post->category_id);
                if ($category) {
                    $category->increment('post_count');
                } else {
                    Log::warning("Category not found for post ID: {$post->id}, category ID: {$post->category_id}");
                }
            } catch (\Exception $e) {
                Log::error("Error seeding post {$i}: " . $e->getMessage());
            }
        }
    }
}