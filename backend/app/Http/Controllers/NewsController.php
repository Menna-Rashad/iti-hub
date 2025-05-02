<?php
namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Notification; // استيراد موديل Notification
use App\Events\NotificationSent; // استيراد الـ Event
use App\Models\User; // استيراد موديل User
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        return response()->json(News::latest()->get());
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);
    
        try {
            $imagePath = null;
    
            if ($request->hasFile('image')) {
                if (!Storage::disk('public')->exists('news')) {
                    Storage::disk('public')->makeDirectory('news');
                }
    
                $imagePath = $request->file('image')->store('news', 'public');
            }
    
            $news = News::create([
                'title' => $request->title,
                'content' => $request->content,
                'image' => $imagePath,
            ]);

            // إرسال إشعار لكل المستخدمين
            $users = User::all();
            $responseNotifications = [];

            foreach ($users as $user) {
                $notification = Notification::create([
                    'user_id' => $user->id,
                    'sender_id' => auth()->id(),
                    'message' => 'A new news article has been posted: ' . $news->title,
                    'type' => 'news_update',
                    'related_id' => $news->id,
                    'related_type' => 'news',
                    'is_read' => false,
                ]);

                $responseNotifications[] = [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'message' => $notification->message,
                    'is_read' => $notification->is_read,
                    'created_at' => optional($notification->created_at)->toIso8601String(),
                ];

                event(new NotificationSent($notification)); // بث الإشعار عبر قاعدة البيانات
            }
    
            return response()->json($news, 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(News $news)
    {
        //
    }

    public function edit(News $news)
    {
        //
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $news = News::findOrFail($id);
    
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'image' => 'nullable|image|max:2048',
        ]);
    
        $news->title = $request->title ?? $news->title;
        $news->content = $request->content ?? $news->content;
    
        if ($request->hasFile('image')) {
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }
    
            $path = $request->file('image')->store('news', 'public');
            $news->image = $path;
        }
    
        $news->save();
    
        return response()->json($news);
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $news = News::findOrFail($id);
    
        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }
    
        $news->delete();
    
        return response()->json(['message' => 'Deleted successfully']);
    }
}
