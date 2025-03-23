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
use App\Models\User;
use Illuminate\Support\Facades\Auth;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('test', function () {
    return response()->json(['message' => 'Test route is working']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);

    Route::post('/mentorship/book', [MentorshipController::class, 'bookSession']);
    Route::get('/mentorship/sessions', [MentorshipController::class, 'getUserSessions']);
    Route::post('/mentorship/cancel/{id}', [MentorshipController::class, 'cancelSession']);
    Route::post('/mentorship/rate/{id}', [MentorshipController::class, 'rateSession']);

    Route::get('/jobs', [JobListingController::class, 'index']);
    Route::post('/jobs', [JobListingController::class, 'store']);
    Route::get('/jobs/{id}', [JobListingController::class, 'show']);
    Route::put('/jobs/{id}', [JobListingController::class, 'update']);
    Route::delete('/jobs/{id}', [JobListingController::class, 'destroy']);

    Route::prefix('forum')->group(function () {
        Route::get('/forum/posts/{id}', [ForumPostController::class, 'show']);
        Route::get('posts/search', [ForumPostController::class, 'search']);

        Route::post('posts/{post}/comments', [CommentController::class, 'store']);
        Route::apiResource('posts', ForumPostController::class);

        Route::get('posts/{post}/comments', [CommentController::class, 'index']);
        Route::apiResource('comments', CommentController::class)->except(['index']);

        Route::post('/vote', [VoteController::class, 'handleVote']);
    });

    Route::get('/admin/dashboard', function (Request $request) {
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
