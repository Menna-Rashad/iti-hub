<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
{
    $user = $request->user();
    
    // Validate the input fields
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email',
        'national_id' => 'nullable|string|max:14',
        'role' => 'nullable|in:student,graduate,mentor,admin',
        'bio' => 'nullable|string',
        'linkedin' => 'nullable|url',
        'github' => 'nullable|url',
        'password' => 'nullable|string|confirmed',
        'profile_picture' => 'nullable|image|max:2048',
    ]);
    
    // Prepare data to be updated
    $data = $request->only([
        'name', 'email', 'national_id', 'role', 'bio', 'linkedin', 'github'
    ]);

    // If password is provided, hash it
    if ($request->filled('password')) {
        $data['password'] = Hash::make($request->password);
    }

    // Handle profile picture upload
    if ($request->hasFile('profile_picture')) {
        $file = $request->file('profile_picture');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('profile_pictures'), $filename);
        $data['profile_picture'] = $filename;
    }

    // Update the user with the new data
    $user->update($data);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}

}    