<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MentorshipController; // ✅ أضف هذا السطر

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
});
