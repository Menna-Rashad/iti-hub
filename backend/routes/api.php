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
use App\Http\Controllers\RegisterController;

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


// ==========================
// 🔹 Protected Routes (Require Sanctum Authentication)
// ==========================
Route::middleware('auth:sanctum')->group(function () {

    // ✅ Authentication Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);

    //profile page route
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    // ==========================
    // 🔵 Mentor Dashboard Route (Only accessible by mentors)
    // ==========================
    Route::get('/mentor/dashboard', function () {
        $user = Auth::user();

        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized. You are not a mentor.'], 403);
        }

        return response()->json(['message' => 'Welcome to Mentor Dashboard!']);
    });

    // ==========================
    // 🔵 Mentorship API Routes (Grouped)
    // ==========================
    Route::prefix('mentorship')->group(function () {
        
        // 📌 General Routes (Both mentors & users)
        Route::get('/', [MentorshipController::class, 'getAvailableMentorships']);
        Route::get('/sessions', [MentorshipController::class, 'getUserSessions']);

        // 🟢 User Actions
        Route::post('/{id}/interest', [MentorshipController::class, 'setInterestStatus']);
        Route::put('/{id}/attend', [MentorshipController::class, 'markAsAttending']);
        Route::put('/{id}/feedback', [MentorshipController::class, 'giveFeedback']);
        Route::post('/{id}/rate', [MentorshipController::class, 'rateMentorship']);

        // 🔵 Mentor Actions
        Route::post('/', [MentorshipController::class, 'createMentorship']); // Create session
        Route::get('/mentor-sessions', [MentorshipController::class, 'getMentorSessions']); // Get all mentor sessions
        Route::post('/{id}/cancel', [MentorshipController::class, 'cancelMentorship']); // Cancel session
        Route::delete('/{id}/delete', [MentorshipController::class, 'deleteSession']); // Delete session

        // 📝 Materials Upload & Download
        Route::put('/{mentorship_id}/material', [MentorshipController::class, 'uploadMaterial']);
        Route::get('/material/{material_id}/download', [MentorshipController::class, 'downloadMaterial']);
    });

    // ==========================
    // 🏢 Job Listings Routes
    // ==========================
    Route::prefix('jobs')->group(function () {
        Route::get('/', [JobListingController::class, 'index']);
        Route::post('/', [JobListingController::class, 'store']);
        Route::get('/{id}', [JobListingController::class, 'show']);
        Route::put('/{id}', [JobListingController::class, 'update']);
        Route::delete('/{id}', [JobListingController::class, 'destroy']);
    });

    // ==========================
    // 📝 Forum Routes
    // ==========================
    Route::prefix('forum')->group(function () {
        Route::get('/posts/{id}', [ForumPostController::class, 'show']);
        Route::get('posts/search', [ForumPostController::class, 'search']);
        Route::post('posts/{postId}/comments', [CommentController::class, 'store']);
        Route::apiResource('posts', ForumPostController::class);
        Route::get('posts/{post}/comments', [CommentController::class, 'index']);
      Route::apiResource('comments', CommentController::class)->except(['index']);
        Route::post('/vote', [VoteController::class, 'handleVote']);
    });

    Route::post('/register', [RegisterController::class, 'register']);


    // ==========================
    // 🔴 Admin Dashboard (Protected)
    // ==========================
    Route::get('/admin/dashboard', function () {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized - You are not an admin'], 403);
        }

        return response()->json([
            'message' => 'Welcome to the Admin Dashboard!',
            'users' => User::all()
        ]);
    });
});
