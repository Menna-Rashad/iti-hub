<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumPost; // Use the correct model
use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    public function run()
    {
        $users = DB::table('users')->pluck('id')->all();
        $posts = ForumPost::pluck('id')->all(); // Changed from Post to ForumPost

        foreach ($posts as $postId) {
            for ($i = 0; $i < 10; $i++) {
                Comment::create([
                    'content' => fake()->sentence,
                    'user_id' => $users[array_rand($users)],
                    'post_id' => $postId,
                    'created_at' => now()->subDays(rand(0, 30)),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}