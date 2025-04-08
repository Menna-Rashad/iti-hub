<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Comment;

class CommentController extends Controller
{
    // عرض الكومنتات بترتيب من الأحدث
    public function index($forumPostId): JsonResponse
    {
        $comments = Comment::where('post_id', $forumPostId)
            ->with(['user', 'votes']) // ✅ ضيف votes
            ->orderBy('created_at', 'desc')
            ->get();
        foreach ($comments as $comment) {
            $comment->current_user_vote = $comment->current_user_vote;
        }
    
        return response()->json($comments);
    }
    

    // إضافة كومنت جديد
    public function store(Request $request, $postId): JsonResponse
    {
        logger('📥 Store comment hit for post ID: ' . $postId);
        logger('Request content: ' . $request->content);

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $postId,
            'content' => $request->content,
        ]);

        $comment->load('user'); // رجع معاها بيانات اليوزر

        return response()->json($comment, 201);
    }

    // عرض كومنت واحد (مش مستخدمة غالباً)
    public function show(string $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);
        return response()->json($comment);
    }

    // تعديل كومنت بعد التحقق من صاحبه
    public function update(Request $request, string $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json($comment);
    }

    // حذف كومنت بعد التحقق من صاحبه
    public function destroy(string $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
