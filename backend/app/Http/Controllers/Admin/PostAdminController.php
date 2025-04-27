<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminLog;

class PostAdminController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $posts = ForumPost::with('user')->latest()->get();
        return response()->json($posts);
    }

    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post = ForumPost::findOrFail($id);
        $post->delete();

        AdminLog::create([
            'admin_id' => auth()->id(),
            'action' => "Deleted forum post ID: {$id}",
        ]);

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
