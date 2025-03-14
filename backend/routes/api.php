<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//regestration 
Route::post('/register', [AuthController::class, 'register']);
// 🟢 تسجيل الدخول
Route::post('/login', [AuthController::class, 'login']);

// 🟢 تسجيل الخروج واسترجاع المستخدم محميان بـ Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);
});