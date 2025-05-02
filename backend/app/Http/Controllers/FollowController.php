<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FollowController extends Controller
{
    public function follow($id)
    {
        $user = Auth::user();
    
        if ($user->id == $id) {
            return response()->json(['error' => 'You cannot follow yourself'], 403);
        }
    
        if ($user->following()->where('followed_id', $id)->exists()) {
            return response()->json(['message' => 'You are already following this user'], 200);
        }
    
        $user->following()->attach($id);
    
        return response()->json(['message' => 'Followed successfully']);
    }
    
    
    public function unfollow($id)
    {
        $user = Auth::user();
        $user->following()->detach($id);
        return response()->json(['message' => 'Unfollowed successfully']);
    }
    
    public function followers($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user->followers);
    }
    
    public function following($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user->following);
    }
    public function followersCount($id)
{
    $user = User::findOrFail($id);
    return response()->json(['count' => $user->followers()->count()]);
}

public function followingCount($id)
{
    $user = User::findOrFail($id);
    return response()->json(['count' => $user->following()->count()]);
}
public function getFollowStatus($id)
{
    $user = auth()->user();

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $isFollowing = $user->following()->where('followed_id', $id)->exists();

    return response()->json(['status' => $isFollowing ? 'following' : 'not_following']);
}


}
