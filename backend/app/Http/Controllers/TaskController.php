<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Get all tasks for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $tasks = Task::where('user_id', $user->id)->get();
        return response()->json($tasks);
    }

    /**
     * Store a new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'nullable|in:pending,in_progress,completed',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'status' => $request->status ?? 'pending',
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Task created', 'task' => $task], 201);
    }

    /**
     * Update a task
     */
    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        $task->title = $request->title;
        $task->status = $request->status;
        $task->updated_at = now();
        $task->save();

        return response()->json(['message' => 'Task updated', 'task' => $task]);
    }

    /**
     * Delete a task
     */
    public function destroy(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}
