<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ForumPost;
use App\Models\Comment;
use App\Models\SupportTicket;
use App\Models\Task;

class DummyDashboardSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(5)->create();
        ForumPost::factory()->count(10)->create();
        Comment::factory()->count(30)->create();
        SupportTicket::factory()->create(['status' => 'open']);
        SupportTicket::factory()->create(['status' => 'closed']);
        Task::factory()->create(['status' => 'pending']);
    }
}
