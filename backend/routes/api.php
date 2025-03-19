<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\MentorshipController; // ✅ أضف هذا السطر
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\AdminController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\VoteController;



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


 // لإنشاء الجلسة بواسطة الموجه
// إنشاء الجلسة بواسطة الموجه
Route::post('/mentorship', [MentorshipController::class, 'createMentorship']);
    Route::get('/mentorship', [MentorshipController::class, 'getAvailableMentorships']);
    Route::post('/mentorship/{id}/interest', [MentorshipController::class, 'setInterestStatus']);
    Route::put('/mentorship/{id}/attend', [MentorshipController::class, 'markAsAttending']);
    Route::put('/mentorship/{id}/cancel', [MentorshipController::class, 'cancelMentorship']);
    Route::post('/mentorship/{id}/rate', [MentorshipController::class, 'rateMentorship']);
    Route::put('/mentorship/{mentorship_id}/feedback', [MentorshipController::class, 'giveFeedback']);
    Route::put('/mentorship/{mentorship_id}/material', [MentorshipController::class, 'uploadMaterial']);
    Route::get('/material/{material_id}/download', [MentorshipController::class, 'downloadMaterial']);


    // ✅ مسارات الوظائف (Jobs)
    // Route::apiResource('jobs', JobListingController::class);
    Route::get('/jobs', [JobListingController::class, 'index']);
    Route::post('/jobs', [JobListingController::class, 'store']);
    Route::get('/jobs/{id}', [JobListingController::class, 'show']);
    Route::put('/jobs/{id}', [JobListingController::class, 'update']);
    Route::delete('/jobs/{id}', [JobListingController::class, 'destroy']);

   
});

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

// 🔴 Admin Dashboard (Protect Without Kernel.php)
Route::get('/admin/dashboard', function (Request $request) {
    $user = Auth::user();

    if (!$user || $user->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized - You are not an admin'], 403);
    }

    return response()->json([
        'message' => 'Welcome to the Admin Dashboard!',
        'users' => User::all()
    ]);
})->middleware('auth:sanctum');

