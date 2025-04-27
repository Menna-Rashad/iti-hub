<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ForumPost;
use App\Models\Comment;
use App\Models\SupportTicket;
use App\Models\Task;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'users_count' => User::count(),
            'posts_count' => ForumPost::count(),
            'comments_count' => Comment::count(),
            'open_tickets_count' => SupportTicket::where('status', 'open')->count(),
            'closed_tickets_count' => SupportTicket::where('status', 'closed')->count(),
            'tasks_count' => Task::count(),
            'latest_users' => User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
            'latest_posts' => ForumPost::latest()->take(5)->get(['id', 'title', 'created_at']),
            'latest_tickets' => SupportTicket::latest()->take(5)->get(['id', 'title', 'status', 'created_at']),
        ]);
    }
}
