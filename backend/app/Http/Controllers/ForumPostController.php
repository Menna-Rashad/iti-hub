<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
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
            $forumPosts = ForumPost::with(['comments.user', 'votes.user', 'category' ])->get();

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
            'tags' => 'nullable|string',
            'media.*' => 'file|mimes:jpg,jpeg,png,gif,mp4,mp3,zip,pdf,docx,doc,ppt,pptx|max:51200' // max 50MB
        ]);

        $forumPost = ForumPost::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'category_id' => $request->category_id,
            'tags' => $request->tags,
        ]);

        if ($request->hasFile('media')) {
            $mediaPaths = [];
            foreach ($request->file('media') as $file) {
                $mediaPaths[] = $file->store('posts_media', 'public');
            }
            $forumPost->media = $mediaPaths;
            $forumPost->save();
        }

        return response()->json($forumPost, 201);
    }

    public function show(string $id)
    {
        try {
            $forumPost = ForumPost::with(['comments.user', 'votes', 'category', 'user'])->findOrFail($id);
            $forumPost->refreshVoteCounts();
    
            $forumPost->media = $forumPost->media ?? [];
            return response()->json($forumPost->toArray(), 200);
            
        } catch (\Exception $e) {
            $forumPost->media = $forumPost->media ?? []; // fallback لو null
            return response()->json($forumPost->toArray(), 200); // يخلي media ترجع array دايمًا

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
    Log::info('Update request:', $request->all());
    Log::info('✔️ title: ' . $request->input('title'));
    Log::info('✔️ content: ' . $request->input('content'));
    Log::info('✔️ tags: ' . $request->input('tags'));
    Log::info('✔️ category_id: ' . $request->input('category_id'));
    
    $post = ForumPost::findOrFail($id);
    $this->authorize('update', $post);

    // 🛡️ Validate
    $request->validate([
        'media.*' => 'file|mimes:jpg,jpeg,png,gif,mp4,mp3,zip,pdf,docx,doc,ppt,pptx|max:51200'
    ]);

    // ✅ استخدم input بدال has
    $post->title = $request->input('title', $post->title);
    $post->content = $request->input('content', $post->content);
    $post->tags = $request->input('tags', $post->tags);
    $post->category_id = $request->input('category_id', $post->category_id);

    // ✅ Handle media
    $mediaFiles = $request->allFiles()['media'] ?? [];
    if (!is_array($mediaFiles)) {
        $mediaFiles = [$mediaFiles];
    }

    $newMediaPaths = [];
    foreach ($mediaFiles as $file) {
        if ($file && $file->isValid()) {
            $newMediaPaths[] = $file->store('posts_media', 'public');
        }
    }

    $existingMedia = json_decode($request->input('existing_media') ?? '[]');
    $post->media = array_merge($existingMedia, $newMediaPaths);
    $post->save();

    return response()->json($post->toArray(), 200);
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
