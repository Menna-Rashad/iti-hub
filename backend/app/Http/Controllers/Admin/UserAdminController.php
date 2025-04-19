<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserAdminController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::all();
        return response()->json($users);
    }
    public function updateRole(Request $request, $id)
{
    if (auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'role' => 'required|in:user,admin',
    ]);

    $user = User::findOrFail($id);

    // Prevent self role downgrade
    if ($user->id === auth()->id()) {
        return response()->json(['message' => "You can't change your own role"], 400);
    }

    $user->role = $request->role;
    $user->save();

    return response()->json(['message' => 'User role updated successfully', 'user' => $user]);
}


    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        // prevent self-deletion
        if ($user->id === Auth::id()) {
            return response()->json(['message' => "You can't delete yourself"], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
