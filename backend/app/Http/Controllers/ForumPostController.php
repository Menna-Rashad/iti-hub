<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Models\ForumPost;
use App\Models\Comment;
use App\Models\Vote;
use App\Models\User;
use App\Models\Badge;

class ForumPostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        try {
            $forumPosts = ForumPost::with(['comments.user', 'votes.user', 'category'])->get();

            return response()->json($forumPosts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading posts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|string'
        ]);

        $forumPost = ForumPost::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'category_id' => $request->category_id,
            'tags' => $request->tags
        ]);

        // Call the badge assignment function after storing the post
       
        return response()->json($forumPost, 201);
    }

    public function show(string $id)
    {
        try {
            $forumPost = ForumPost::with(['comments.user', 'comments.user','votes', 'category'])->findOrFail($id);
            foreach ($forumPost->comments as $comment) {
                $comment->current_user_vote = $comment->current_user_vote;
            }         
            $forumPost->refreshVoteCounts();
    
             //we need to get the current user vote
             $forumPost->current_user_vote = $forumPost->current_user_vote; 
             
            return response()->json($forumPost);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'خطأ في الخادم',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
    

    public function update(Request $request, $id)
    {
        try {
            $post = ForumPost::findOrFail($id);
            $this->authorize('update', $post);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'category_id' => 'nullable|exists:categories,id',
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
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        $forumPost = ForumPost::findOrFail($id);
        $forumPost->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:1',
            'category' => 'nullable|integer|exists:categories,id',
            'sort' => 'nullable|in:newest,top'
        ]);

        $searchTerm = $request->input('query');

        $query = ForumPost::query()
            ->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%$searchTerm%")
                  ->orWhere('content', 'LIKE', "%$searchTerm%")
                  ->orWhere('tags', 'LIKE', "%$searchTerm%");
            });

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

   
}