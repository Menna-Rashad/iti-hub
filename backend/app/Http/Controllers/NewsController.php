<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(News::latest()->get());
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
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
    
            return response()->json($news, 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    

    /**
     * Display the specified resource.
     */
    public function show(News $news)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(News $news)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $id)
    {
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
    
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);
    
        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }
    
        $news->delete();
    
        return response()->json(['message' => 'Deleted successfully']);
    }
    
    
}
