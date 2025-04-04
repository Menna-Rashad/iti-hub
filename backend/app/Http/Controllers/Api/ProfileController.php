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

    $data = $request->only([
        'name', 'email', 'national_id', 'role', 'bio', 'linkedin', 'github'
    ]);

    if ($request->filled('password')) {
        $data['password'] = Hash::make($request->password);
    }

    // ✅ حذف الصورة القديمة لو موجودة
    if ($request->hasFile('profile_picture')) {
        if ($user->profile_picture && file_exists(public_path('profile_pictures/' . $user->profile_picture))) {
            unlink(public_path('profile_pictures/' . $user->profile_picture));
        }

        $file = $request->file('profile_picture');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('profile_pictures'), $filename);
        $data['profile_picture'] = $filename;
    }

    $user->update($data);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}

}
