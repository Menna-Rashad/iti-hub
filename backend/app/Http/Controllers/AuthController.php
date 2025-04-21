<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
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
        } catch (Exception $e) {
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

    public function login(Request $request): JsonResponse
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
                'national_id' => $user->national_id,
                'linkedin' => $user->linkedin,
                'github' => $user->github,
            ],
        ], 200);
    }

    public function googleManualRegister(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->id_token,
        ]);

        if (!$response->ok()) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $googleUser = $response->json();
        $email = $googleUser['email'] ?? null;
        $name = $googleUser['name'] ?? 'Google User';
        $googleId = $googleUser['sub'] ?? null;
        $audience = $googleUser['aud'] ?? null;

        if (!$email || !$googleId) {
            return response()->json(['message' => 'Missing required user information from token'], 422);
        }

        $clientId = env('GOOGLE_CLIENT_ID');
        if ($audience !== $clientId) {
            return response()->json(['message' => 'Invalid token audience'], 401);
        }

        $existingUser = User::where('email', $email)->orWhere('google_id', $googleId)->first();
        if ($existingUser) {
            return response()->json(['message' => 'User already exists. Please login instead.'], 400);
        }

        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->google_id = $googleId;
        $user->password = Hash::make(uniqid());
        $user->national_id = str_pad(mt_rand(1, 99999999999999), 14, '0', STR_PAD_LEFT);
        $user->role = 'user';
        $user->is_verified = true;
        $user->email_verified_at = now();
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        logger()->info('User registered with Google: ' . $user->email);

        return response()->json([
            'message' => 'Google registration successful',
            'token' => $token,
            'email_verified' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'national_id' => $user->national_id,
                'linkedin' => $user->linkedin,
                'github' => $user->github,
            ],
        ], 201);
    }

    public function googleManualLogin(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->id_token,
        ]);

        if (!$response->ok()) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $googleUser = $response->json();
        $email = $googleUser['email'] ?? null;
        $googleId = $googleUser['sub'] ?? null;
        $audience = $googleUser['aud'] ?? null;

        if (!$email || !$googleId) {
            return response()->json(['message' => 'Missing required user information from token'], 422);
        }

        $clientId = env('GOOGLE_CLIENT_ID');
        if ($audience !== $clientId) {
            return response()->json(['message' => 'Invalid token audience'], 401);
        }

        $user = User::where('google_id', $googleId)->orWhere('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found. Please register first.'], 404);
        }

        if (!$user->is_verified) {
            return response()->json(['message' => 'Please verify your email before logging in.'], 403);
        }

        if (!$user->google_id) {
            $user->google_id = $googleId;
            $user->save();
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        logger()->info('User logged in with Google: ' . $user->email);

        return response()->json([
            'message' => 'Google login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'national_id' => $user->national_id,
                'linkedin' => $user->linkedin,
                'github' => $user->github,
            ],
        ], 200);
    }

    public function verifyEmail(Request $request, $token): JsonResponse
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

        logger()->info('Email verified for user: ' . $user->email);

        return response()->json([
            'message' => 'Email verified successfully. You can now login.',
            'redirect' => 'http://localhost:4200/login?email_verified=true'
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $userEmail = $request->user()->email;
        $request->user()->currentAccessToken()->delete();

        logger()->info('User logged out: ' . $userEmail);

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->email_verification_token = Str::random(32);
        $user->save();

        try {
            $user->notify(new EmailVerificationNotification($user));
        } catch (Exception $e) {
            logger()->error('Failed to resend verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to resend verification email. Please try again later.',
            ], 500);
        }

        return response()->json(['message' => 'Verification email resent successfully.'], 200);
    }
}
