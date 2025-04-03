<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\password;

class RegisterController extends Controller
{
    

    public function register (Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed|min:6',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
            'profilePicture'=> 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->input('password') !== $request->input('confirmPassword')) {
            return response()->json([
                'error' => 'Passwords do not match.'
            ], 422);
        }
       $profilePath = null;

       if($request->hasFile('profilePicture')){
        $profilePath = $request->file('profilePicture')->store('profile_pictures', 'public');
       }
        
       $user = User::create([
           'name'            => $request->input('name'),
           'email'           => $request->input('email'),
           'password'        => Hash::make($request->input('password')),
           'linkedin'        => $request->input('linkedin'),
           'github'          => $request->input('github'),
           'profile_picture' => $profilePath,
       ]);

       return response()->json([
           'message' => 'User registered successfully',
           'user' => $user
       ], 201);
    }

    

}
