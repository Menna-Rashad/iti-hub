<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MentorshipSession;
use App\Models\ForumPost;
use App\Models\Comment;
use App\Models\Task;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. بيانات الجلسات
        $mentorshipCompleted = MentorshipSession::where('mentee_id', $user->id)
                                ->where('session_status', 'completed')
                                ->count();
        $mentorshipTotal = MentorshipSession::where('mentee_id', $user->id)->count();

        // 2. المشاركات والتعليقات
        $postsCount = ForumPost::where('user_id', $user->id)->count();
        $commentsCount = Comment::where('user_id', $user->id)->count();

        // 3. المهام
        $tasks = Task::where('user_id', $user->id)->get();

        // 4. التذاكر (هنسيبها دلوقتي مؤقتاً لو لسه مش متحددة)

        return response()->json([
            'user' => [
                'name' => $user->name,
                'avatar' => $user->profile_picture,
                'level' => 'Beginner'
            ],
            'mentorship' => [
                'completed' => $mentorshipCompleted,
                'total' => $mentorshipTotal
            ],
            'posts' => [
                'posts' => $postsCount,
                'comments' => $commentsCount
            ],
            'tasks' => $tasks,
            // 'tickets' => [...], // نضيفها لما تحددي الجدول
        ]);
    }
}
