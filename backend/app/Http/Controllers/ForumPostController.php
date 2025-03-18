<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Models\ForumPost;  // تأكد من استيراد الموديل الخاص بالمنتدى

class ForumPostController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forumPosts = ForumPost::with(['comments', 'votes', 'category'])->get();
        return response()->json($forumPosts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // التحقق من صحة البيانات المدخلة
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id', // تأكد من وجوده هنا
            'tags' => 'nullable|string' // أضف التحقق من صحة tags
        ]);

        // إنشاء الموضوع
        $forumPost = ForumPost::create([
            'user_id' => auth()->id(),  // يتطلب التوثيق عبر المستخدم
            'title' => $request->title,
            'content' => $request->content,
            'category_id' => $request->category_id, // أضفه هنا
            'tags' => $request->tags // تأكد من تعيين القيمة
        ]);

        return response()->json($forumPost, 201);  // إرجاع الموضوع الجديد مع حالة HTTP 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $forumPost = ForumPost::with(['comments', 'votes', 'category'])->findOrFail($id);
        return response()->json($forumPost);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ForumPost $post)
    {
        try {
            $this->authorize('update', $post);
    
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'category_id' => 'nullable|exists:categories,id', // تأكد من وجود الفئة
                'tags' => 'nullable|string'
            ]);
    
            $post->update($validated);
    
            return response()->json($post, 200);
    
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json(['message' => 'غير مصرح به'], 403);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'المنشور غير موجود'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'خطأ في الخادم',
                'error' => $e->getMessage() // (تفعيل في وضع التصحيح فقط)
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // حذف الموضوع باستخدام المعرف
        $forumPost = ForumPost::findOrFail($id);
        $forumPost->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }
    public function search(Request $request) {
        $request->validate([
            'query' => 'required|string|min:1',
            'category' => 'nullable|integer|exists:categories,id',
            'sort' => 'nullable|in:newest,top'
        ]);

        $searchTerm = $request->input('query');
        $query = ForumPost::query()
            ->where(function($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%$searchTerm%")
                  ->orWhere('content', 'LIKE', "%$searchTerm%")
                  ->orWhere('tags', 'LIKE', "%$searchTerm%");
            });
    
        $query = ForumPost::query()
            ->where('title', 'LIKE', "%{$request->input('query')}%")
            ->orWhere('content', 'LIKE', "%{$request->input('query')}%")
            ->orWhere('tags', 'LIKE', "%{$request->input('query')}%");
    
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
    
        if ($request->input('sort') === 'top') {
            $query->withCount(['votes as upvotes', 'votes as downvotes'])
                  ->orderByRaw('(upvotes - downvotes) DESC');
        } else {
            $query->orderBy('created_at', 'DESC');
        }
    
        return response()->json($query->paginate(10));
    }
    
    // public function search(Request $request) {
    //     \Log::info('Search request received', $request->all());
    
    //     $request->validate([
    //         'query' => 'required|string|min:1',
    //         'category' => 'nullable|integer|exists:categories,id',
    //         'sort' => 'nullable|in:newest,top'
    //     ]);
    
    //     $searchTerm = $request->input('query');
    //     $categoryId = $request->input('category');
    //     $sortType = $request->input('sort', 'newest');
    
    //     try {
    //         $query = ForumPost::with(['user', 'category', 'votes'])
    //             ->where(function($q) use ($searchTerm) {
    //                 $q->where('title', 'LIKE', "%{$searchTerm}%")
    //                   ->orWhere('content', 'LIKE', "%{$searchTerm}%")
    //                   ->orWhere('tags', 'LIKE', "%{$searchTerm}%");
    //             });
    
    //         if ($categoryId) {
    //             $query->where('category_id', $categoryId);
    //         }
        
    //         if ($sortType === 'top') {
    //             $query->withCount([
    //                     'votes as upvotes_count' => function ($q) {
    //                         $q->where('vote_type', 'upvote');
    //                     },
    //                     'votes as downvotes_count' => function ($q) {
    //                         $q->where('vote_type', 'downvote');
    //                     }
    //                 ])
    //                 ->orderByRaw('(upvotes_count - downvotes_count) DESC');
    //         } else {
    //             $query->orderBy('created_at', 'DESC');
    //         }
    
    //         $results = $query->paginate(10);
    
    //         \Log::info('Search results', ['results' => $results]);
    
    //         return response()->json($results);

    //     } catch (\Exception $e) {
    //         \Log::error('Search error', ['error' => $e->getMessage()]);
    
    //         return response()->json([
    //             'message' => 'حدث خطأ أثناء البحث. الرجاء المحاولة مرة أخرى.',
    //             'error' => config('app.debug') ? $e->getMessage() : null
    //         ], 500);
    //     }
    // }
}
