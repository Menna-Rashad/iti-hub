<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // التحقق من البيانات المدخلة
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed', // تأكد من أن كلمة المرور تؤكد بشكل صحيح
        ]);

        // إنشاء مستخدم جديد
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // تشفير كلمة المرور
        ]);

        // إنشاء توكن API باستخدام Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'token' => $token,
            'user' => $user
        ], 201);
    }
    // 🟢 تسجيل الدخول وإصدار توكن للمستخدم
    public function login(Request $request)
    {
        // ✅ التحقق من البيانات المدخلة
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        // 🔄 محاولة تسجيل الدخول
        $user = User::where('email', $request->email)->first();

        // ❌ إذا لم يجد المستخدم أو كلمة المرور غير صحيحة
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 🟢 إنشاء توكن API باستخدام Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ إرسال استجابة مع التوكن
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    // 🟢 تسجيل خروج المستخدم
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    // 🟢 استرجاع بيانات المستخدم الحالي
    public function getUser(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
