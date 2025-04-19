<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MentorshipController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TopContributorsController;
use App\Http\Controllers\OpenProjectController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\TicketReplyController;
use App\Http\Controllers\SupportTicketReplyController;
use App\Http\Controllers\Admin\TicketReplyAdminController;
use App\Http\Controllers\TicketNotificationController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\Admin\SupportTicketAdminController;
use App\Http\Controllers\Admin\PostAdminController;
use App\Http\Controllers\Admin\TaskAdminController;

// ==========================
// 🔹 Public Routes (No Authentication Required)
// ==========================

// ✅ User Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Test Route (For Debugging)
Route::get('/test', function () {
    return response()->json(['message' => 'Test route is working']);
});

// Reset‑password routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// ==========================
// 🔹 Protected Routes (Require Sanctum Authentication)
// ==========================
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('admin')->group(function () {
        Route::get('/tasks', [\App\Http\Controllers\Admin\TaskAdminController::class, 'index']);
        Route::delete('/tasks/{id}', [\App\Http\Controllers\Admin\TaskAdminController::class, 'destroy']);    
        Route::get('/comments', [\App\Http\Controllers\Admin\CommentAdminController::class, 'index']);
        Route::delete('/comments/{id}', [\App\Http\Controllers\Admin\CommentAdminController::class, 'destroy']);    
        Route::get('/users', [\App\Http\Controllers\Admin\UserAdminController::class, 'index']);
        Route::put('/users/{id}/role', [\App\Http\Controllers\Admin\UserAdminController::class, 'updateRole']);
        Route::delete('/users/{id}', [\App\Http\Controllers\Admin\UserAdminController::class, 'destroy']);
        Route::get('/posts', [\App\Http\Controllers\Admin\PostAdminController::class, 'index']);
        Route::delete('/posts/{id}', [\App\Http\Controllers\Admin\PostAdminController::class, 'destroy']);

    });
    Route::prefix('admin')->group(function () {
        Route::put('/support-tickets/{id}/edit', [SupportTicketAdminController::class, 'updateTicket']);
        Route::get('/support-tickets', [\App\Http\Controllers\Admin\SupportTicketAdminController::class, 'index']);
    });
    Route::prefix('admin')->group(function () {
        Route::get('/ticket-replies', [\App\Http\Controllers\Admin\TicketReplyAdminController::class, 'index']);
        Route::post('/support-tickets/{id}/reply', [\App\Http\Controllers\Admin\TicketReplyAdminController::class, 'store']);
        Route::delete('/ticket-replies/{id}', [\App\Http\Controllers\Admin\TicketReplyAdminController::class, 'destroy']);
    });
    
    // ✅ Authentication Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',   [AuthController::class, 'getUser']);

    // Profile page routes
    Route::get('/profile',          [ProfileController::class, 'show']);
    Route::post('/profile/update',  [ProfileController::class, 'update']);

    // ✅ Dashboard Route
    Route::get('/user/dashboard', [UserDashboardController::class, 'index']);

    // ==========================
    // 🔵 Mentor Dashboard Route (only mentors)
    // ==========================
    Route::get('/mentor/dashboard', function () {
        $user = Auth::user();

        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized. You are not a mentor.'], 403);
        }

        return response()->json(['message' => 'Welcome to Mentor Dashboard!']);
    });

    // ==========================
    // 🔵 Mentorship API Routes
    // ==========================
    Route::prefix('mentorship')->group(function () {
        // 📌 General Routes (mentors & users)
        Route::get('/',            [MentorshipController::class, 'getAvailableMentorships']);
        Route::get('/sessions',    [MentorshipController::class, 'getUserSessions']);

        // 🟢 User Actions
        Route::post('/{id}/interest', [MentorshipController::class, 'setInterestStatus']);
        Route::put('/{id}/attend',    [MentorshipController::class, 'markAsAttending']);
        Route::put('/{id}/feedback',  [MentorshipController::class, 'giveFeedback']);
        Route::post('/{id}/rate',     [MentorshipController::class, 'rateMentorship']);

        // 🔵 Mentor Actions
        Route::post('/',              [MentorshipController::class, 'createMentorship']);
        Route::get('/mentor-sessions',[MentorshipController::class, 'getMentorSessions']);
        Route::post('/{id}/cancel',   [MentorshipController::class, 'cancelMentorship']);
        Route::delete('/{id}/delete', [MentorshipController::class, 'deleteSession']);

        // 📝 Materials
        Route::put('/{mentorship_id}/material',   [MentorshipController::class, 'uploadMaterial']);
        Route::get('/material/{material_id}/download', [MentorshipController::class, 'downloadMaterial']);
    });

    // ==========================
    // 🏢 Job Listings Routes
    // ==========================
    Route::prefix('jobs')->group(function () {
        Route::get('/',      [JobListingController::class, 'index']);
        Route::post('/',     [JobListingController::class, 'store']);
        Route::get('/{id}',  [JobListingController::class, 'show']);
        Route::put('/{id}',  [JobListingController::class, 'update']);
        Route::delete('/{id}', [JobListingController::class, 'destroy']);
    });

    // ==========================
    // 📝 Forum Routes
    // ==========================
    Route::prefix('forum')->group(function () {
        Route::get('/posts/{id}',            [ForumPostController::class, 'show']);
        Route::get('posts/search',           [ForumPostController::class, 'search']);
        Route::post('posts/{postId}/comments', [CommentController::class, 'store']);
        Route::apiResource('posts',          ForumPostController::class);
        Route::get('posts/{post}/comments',  [CommentController::class, 'index']);
        Route::apiResource('comments',       CommentController::class)->except(['index']);
        Route::post('/vote',                 [VoteController::class, 'handleVote']);
    }); // ← قفلة جروب forum

    // Categories (still protected)
    Route::get('/categories', [CategoryController::class, 'index']);

    // ==========================
    // 🔰 Top Contributors
    // ==========================
    Route::prefix('top-contributors')->group(function () {
        Route::post('/assign-initial-badge/{userId}',    [TopContributorsController::class, 'assignInitialBadge']);
        Route::post('/assign-post-badge/{userId}',       [TopContributorsController::class, 'assignPostBadge']);
        Route::post('/assign-engagement-badge/{userId}', [TopContributorsController::class, 'assignEngagementBadge']);
        Route::post('/assign-activity-badge/{userId}',   [TopContributorsController::class, 'assignActivityBadge']);
        Route::post('/assign-achievement-badge/{userId}',[TopContributorsController::class, 'assignAchievementBadge']);
        Route::post('/assign-mentorship-points/{userId}',[TopContributorsController::class, 'assignMentorshipPoints']);

        // ✅ GET Endpoints
        Route::get('/badges/{userId}', [TopContributorsController::class, 'getUserBadges']);
        Route::get('/score/{userId}',  [TopContributorsController::class, 'getUserScore']);
    });

    // ==========================
    // 📋 Tasks
    // ==========================
    Route::prefix('tasks')->controller(TaskController::class)->group(function () {
        Route::get('/',      'index');
        Route::post('/',     'store');
        Route::put('/{id}',  'update');
        Route::delete('/{id}', 'destroy');
    });

    // ==========================
    // 🔴 Admin Dashboard
    // ==========================
    Route::get('/admin/dashboard', function () {
        $user = Auth::user();
    
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized - You are not an admin'], 403);
        }
    
        return response()->json([
            'message' => 'Welcome to the Admin Dashboard!',
            'users'   => \App\Models\User::all(),
            'stats'   => [
                'total_users' => \App\Models\User::count(),
                'admins'      => \App\Models\User::where('role', 'admin')->count(),
                'tickets'     => \App\Models\SupportTicket::count(),
                'open_tickets' => \App\Models\SupportTicket::where('status', 'open')->count(),
            ],
        ]);
    });
    

    // Support‑ticket replies
    Route::delete('/support-ticket-replies/{id}', [SupportTicketReplyController::class, 'destroy']);
    Route::get('/support-tickets/{id}/replies',   [SupportTicketReplyController::class, 'getReplies']);

    Route::get('/support-tickets/{id}/replies',   [SupportTicketReplyController::class, 'index']);
    Route::put('/support-tickets/{id}/status',    [SupportTicketController::class, 'updateStatus']);
    Route::delete('/admin/support-tickets/{id}', [SupportTicketController::class, 'destroy']);

    Route::post('/admin/support-tickets/{id}/reply', [SupportTicketReplyController::class, 'adminReply']);

    // Open projects
    Route::prefix('open-projects')->group(function () {
        Route::get('/',      [OpenProjectController::class, 'index']);
        Route::post('/',     [OpenProjectController::class, 'store']);
        Route::put('/{id}',  [OpenProjectController::class, 'update']);
        Route::delete('/{id}', [OpenProjectController::class, 'destroy']);
    });

    // Support tickets
    Route::prefix('support-tickets')->group(function () {
        Route::get('/',        [SupportTicketController::class, 'index']);
        Route::post('/',       [SupportTicketController::class, 'store']);
        Route::get('/{id}',    [SupportTicketController::class, 'show']);
        Route::post('/{id}/replies', [SupportTicketReplyController::class, 'store']);
    });

    // Ticket notifications
    Route::prefix('ticket-notifications')->group(function () {
        Route::get('/',                 [TicketNotificationController::class, 'index']);
        Route::put('/{id}/read',        [TicketNotificationController::class, 'markAsRead']);
        Route::put('/read-all',         [TicketNotificationController::class, 'markAllAsRead']);
        Route::get('/unread-count',     [TicketNotificationController::class, 'countUnread']);
    });
}); // ← قفلة جروب auth:sanctum (آخر الملف)
