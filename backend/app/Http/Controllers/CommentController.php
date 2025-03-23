<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index($forumPostId): JsonResponse
    {
        $comments = Comment::where('post_id', $forumPostId)->get();

        return response()->json($comments);
    }

    public function store(Request $request, $postId): JsonResponse
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'post_id' => $postId,
            'content' => $request->content,
        ]);

        return response()->json($comment, 201);
    }

    public function show(string $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        return response()->json($comment);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json($comment);
    }

    public function destroy(string $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
