<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // إضافة الاستيراد هنا

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:6',
            'national_id' => 'required|digits:14|unique:users,national_id',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->national_id = $request->national_id;
        $user->role = 'user';
        $user->linkedin = $request->linkedin;
        $user->github = $request->github;
        $user->is_verified = false;
        $user->email_verification_token = Str::random(32);
        $user->save();

        try {
            $user->notify(new EmailVerificationNotification($user));
        } catch (\Exception $e) {
           logger()->error('Failed to send verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'User registered, but failed to send verification email. Please try again later.',
            ], 500);
        }

        return response()->json([
            'message' => 'User registered successfully. Please check your email to verify your account.',
            'email' => $user->email,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            logger()->warning('Failed login attempt for email: ' . $request->email);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->is_verified) {
            return response()->json(['message' => 'Please verify your email before logging in.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        logger()->info('User logged in successfully: ' . $user->email);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function verifyEmail(Request $request, $token)
    {
        $user = User::where('email_verification_token', $token)
                    ->where('is_verified', false)
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token, or email already verified'], 400);
        }

        $user->is_verified = true;
        $user->email_verification_token = null;
        $user->email_verified_at = now();
        $user->save();

        logger()->error('Email verified for user: ' . $user->email);

        return redirect()->away('http://localhost:4200/login?email_verified=true');
    }

    public function logout(Request $request)
    {
        $userEmail = $request->user()->email;
        $request->user()->currentAccessToken()->delete();

        logger()->info('User logged out: ' . $userEmail);

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function resendVerificationEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->is_verified) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->email_verification_token = Str::random(32);
        $user->save();

        try {
            $user->notify(new EmailVerificationNotification($user));
        } catch (\Exception $e) {
            logger()->error('Failed to resend verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to resend verification email. Please try again later.',
            ], 500);
        }

        return response()->json(['message' => 'Verification email resent successfully.']);
    }
}