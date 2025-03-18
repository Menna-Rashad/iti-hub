<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;  // تأكد من استيراد الموديل الخاص بالتعليقات

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($forumPostId)
    {
        // استرجاع التعليقات المرتبطة بالموضوع المعين
        $comments = Comment::where('post_id', $forumPostId)->get();
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // التحقق من صحة البيانات المدخلة
        $request->validate([
            'post_id' => 'required|exists:forum_posts,id',
            'content' => 'required|string',
        ]);

        // إنشاء تعليق جديد
        $comment = Comment::create([
            'user_id' => auth()->id(),  // يتطلب التوثيق عبر المستخدم
            'post_id' => $request->post_id,
            'content' => $request->content,
        ]);

        return response()->json($comment, 201);  // إرجاع التعليق الجديد مع حالة HTTP 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // يمكن إضافة الكود لعرض تعليق معين بناءً على المعرف
        $comment = Comment::findOrFail($id);
        return response()->json($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // يمكن إضافة الكود لتحديث تعليق معين
        $comment = Comment::findOrFail($id);
        $comment->update([
            'content' => $request->content,
        ]);
        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // يمكن إضافة الكود لحذف تعليق معين
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
