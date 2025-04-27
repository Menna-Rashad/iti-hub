<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminLog;

class CommentAdminController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comments = Comment::with('user', 'post')->latest()->get();
        return response()->json($comments);
    }

    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment = Comment::findOrFail($id);
        $comment->delete();

        AdminLog::create([
            'admin_id' => auth()->id(),
            'action' => "Deleted comment ID: {$id}",
        ]);
    
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
