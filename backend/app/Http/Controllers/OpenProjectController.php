<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Log;
use App\Models\OpenProject;
use Illuminate\Http\Request;

class OpenProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = OpenProject::query();
    
    
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }
    
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }
    
        $projects = $query->get();
        return response()->json($projects);
    }
    
    
    public function store(Request $request)
{
    Log::info('Incoming request', $request->all());

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'technologies' => 'nullable|string',
        'github_url' => 'nullable|url',
        'status' => 'required|in:under_development,completed,in_review',
        'category' => 'required|string',
    ]);

    $userId = Auth::id();
    Log::info('Current Auth ID: ' . $userId);

    $project = OpenProject::create([
        'name' => $request->name,
        'description' => $request->description,
        'technologies' => $request->technologies,
        'github_url' => $request->github_url,
        'status' => $request->status,
        'category' => $request->category,
        'user_id' => $userId,
    ]);

    Log::info('Project created:', [$project]);

    return response()->json($project, 201);
}
public function update(Request $request, $id)
{
    $project = OpenProject::findOrFail($id);

    if ($project->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
        return response()->json(['error' => 'Unauthorized'], 403); 
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'technologies' => 'nullable|string',
        'github_url' => 'nullable|url',
        'status' => 'required|in:under_development,completed,in_review',
        'category' => 'required|string',
    ]);

    $project->update([
        'name' => $request->name,
        'description' => $request->description,
        'technologies' => $request->technologies,
        'github_url' => $request->github_url,
        'status' => $request->status,
        'category' => $request->category,
    ]);

    return response()->json($project);
}
public function destroy($id)
{
    $project = OpenProject::findOrFail($id);

    if ($project->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $project->delete();

    return response()->json(['message' => 'Project deleted successfully']);
}


}
