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
    $request->validate([
        'name' => 'required|string|min:3',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|confirmed|min:6',
        'national_id' => 'required|digits:14|unique:users,national_id',
        'linkedin' => 'nullable|url',
        'github' => 'nullable|url',
        'profilePicture'=> 'nullable|file|mimes:jpg,jpeg,png|max:2048',
    ]);

    // معالجة صورة البروفايل لو موجودة
    $profilePath = null;
    if ($request->hasFile('profilePicture')) {
        $profilePath = $request->file('profilePicture')->store('profile_pictures', 'public');
    }
    
    $user = User::create([
        'name'            => $request->name,
        'email'           => $request->email,
        'password'        => Hash::make($request->password),
        'national_id'     => $request->national_id,
        'role'            => 'user',
        'linkedin'        => $request->linkedin,
        'github'          => $request->github,
        'profile_picture' => $profilePath ? basename($profilePath) : null,
    ]);
    

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'User registered successfully!',
        'token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
    ], 201);
}

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role, 
        ]
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function getUser(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
