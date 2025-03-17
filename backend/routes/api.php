<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MentorshipController; // ✅ أضف هذا السطر
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\AdminController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 🟢 تسجيل المستخدم
Route::post('/register', [AuthController::class, 'register']);
// 🟢 تسجيل الدخول
Route::post('/login', [AuthController::class, 'login']);

// 🟢 تسجيل الخروج واسترجاع المستخدم محميان بـ Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);

    // ✅ مسارات الجلسات المهنية (Mentorship)
    Route::post('/mentorship/book', [MentorshipController::class, 'bookSession']); // 🟢 حجز جلسة
    Route::get('/mentorship/sessions', [MentorshipController::class, 'getUserSessions']); // 🔵 استعراض الجلسات الخاصة بالمستخدم
    Route::post('/mentorship/cancel/{id}', [MentorshipController::class, 'cancelSession']); // 🟠 إلغاء الجلسة
    Route::post('/mentorship/rate/{id}', [MentorshipController::class, 'rateSession']); // 🔴 تقييم الجلسة

    // ✅ مسارات الوظائف (Jobs)
    Route::apiResource('jobs', JobListingController::class);
    Route::get('/jobs', [JobListingController::class, 'index']);
    Route::post('/jobs', [JobListingController::class, 'store']);
    Route::put('/jobs/{id}', [JobListingController::class, 'update']);
    Route::delete('/jobs/{id}', [JobListingController::class, 'destroy']);
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