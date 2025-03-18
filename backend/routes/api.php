<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MentorshipController;
use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\CommentController; // أضف هذا
use App\Http\Controllers\VoteController; // أضف هذا

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// 🟢 تسجيل المستخدم
Route::post('/register', [AuthController::class, 'register']);
// 🟢 تسجيل الدخول
Route::post('/login', [AuthController::class, 'login']);

Route::get('test', function () {
    return response()->json(['message' => 'Test route is working']);
});

// 🟢 مجموعة الروابط المحمية بـ Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);

    // ✅ مسارات الجلسات المهنية (Mentorship)
    Route::post('/mentorship/book', [MentorshipController::class, 'bookSession']);
    Route::get('/mentorship/sessions', [MentorshipController::class, 'getUserSessions']);
    Route::post('/mentorship/cancel/{id}', [MentorshipController::class, 'cancelSession']);
    Route::post('/mentorship/rate/{id}', [MentorshipController::class, 'rateSession']);

    // 🟠 مجموعة مسارات المنتدى
    Route::prefix('forum')->group(function () {
        Route::get('posts/search', [ForumPostController::class, 'search']); // <-- أضف هذا السطر داخل المجموعة
        // المواضيع
        Route::apiResource('posts', ForumPostController::class);
        Route::get('posts/{post}/comments', [CommentController::class, 'index']);
        // Route::get('posts/search', [ForumPostController::class, 'search']);
        // التعليقات
        Route::apiResource('comments', CommentController::class)->except(['index']);
        Route::post('forum/comments', [CommentController::class, 'store']);
        // التصويت
        Route::post('vote', [VoteController::class, 'handleVote']);
    });
});

// Route::get('forum/test', function () {
//     return response()->json(['message' => 'Test route is working']);
// });