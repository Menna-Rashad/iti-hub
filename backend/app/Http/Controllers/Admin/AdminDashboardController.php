<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ForumPost;
use App\Models\Comment;
use App\Models\SupportTicket;
use App\Models\Task;
use App\Models\Vote;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function getStatistics()
    {
        $totalUsers = User::count();

        $recentUsers = User::where('created_at', '>=', now()->subDays(30))->count();
        $joinRate = $totalUsers > 0 ? round(($recentUsers / $totalUsers) * 100, 2) : 0;

        $totalTickets = SupportTicket::count();
        $recentOpenTickets = SupportTicket::where('created_at', '>=', now()->subDays(30))
                                         ->where('status', 'open')->count();

        $ticketsWithReplies = SupportTicket::has('replies')->count();
        $responseRate = $totalTickets > 0 ? round(($ticketsWithReplies / $totalTickets) * 100, 1) : 0;

        $recentPosts = ForumPost::where('created_at', '>=', now()->subDays(7))->count();
        $recentComments = Comment::where('created_at', '>=', now()->subDays(7))->count();
        $recentVotes = Vote::where('created_at', '>=', now()->subDays(7))->count();
        $recentNews = News::where('created_at', '>=', now()->subDays(7))->count();

        $activeUsers = User::whereHas('forumPosts', function ($q) {
                                $q->where('created_at', '>=', now()->subDays(7));
                            })->orWhereHas('supportTickets', function ($q) {
                                $q->where('created_at', '>=', now()->subDays(7));
                            })->distinct()->count();

        $topActiveUsers = User::select('id', 'name')
            ->withCount(['forumPosts', 'supportTickets'])
            ->get()
            ->map(function ($user) {
                $user->total_activity = $user->forum_posts_count + $user->support_tickets_count;
                return $user;
            })
            ->sortByDesc('total_activity')
            ->take(5)
            ->values();

        $usersByMonth = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupByRaw('MONTH(created_at)')
            ->orderBy('month')
            ->get();

        $ticketsByStatus = SupportTicket::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $topPosters = User::withCount('forumPosts')
            ->orderByDesc('forum_posts_count')
            ->take(5)
            ->get(['id', 'name']);

        $dailyActivity = ForumPost::selectRaw('DATE(created_at) as day, COUNT(*) as post_count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        return response()->json([
            'total_users' => $totalUsers,
            'recent_users' => $recentUsers,
            'join_rate_percent' => $joinRate,
            'total_tickets' => $totalTickets,
            'recent_open_tickets' => $recentOpenTickets,
            'ticket_response_rate' => $responseRate,
            'recent_posts' => $recentPosts,
            'recent_comments' => $recentComments,
            'recent_votes' => $recentVotes,
            'recent_news' => $recentNews,
            // 'active_users_last_7_days' => $activeUsers,
            // 'top_active_users' => $topActiveUsers,
            'users_by_month' => $usersByMonth, // in user frontend
            // 'tickets_by_status' => $ticketsByStatus,
            // 'top_posters' => $topPosters,
            // 'daily_forum_activity' => $dailyActivity
        ]);
    }
}
