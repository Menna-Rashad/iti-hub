<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Store a new task
     */
    public function store(Request $request)
    {
        // Improved validation for status and due_date
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed',  // status is required and must match one of the options
            'due_date' => 'nullable|date',  // due_date is optional but must be a valid date if provided
        ], [
            'title.required' => 'The title field is required.',
            'status.required' => 'The status field is required.',
            'status.in' => 'The status must be one of the following: pending, in_progress, completed.',
            'due_date.date' => 'The due date must be a valid date.'
        ]);

        // Create the new task
        $task = Task::create([
            'title' => $request->title,
            'status' => $request->status ?? 'pending',
            'user_id' => $request->user()->id,
            'due_date' => $request->due_date, // Store due date if provided
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    /**
     * Update a task
     */
    public function update(Request $request, $id)
    {
        // Find the task
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        // Improved validation for status and due_date
        $request->validate([
            'status' => 'nullable|in:pending,in_progress,completed',  // If status is provided, must match options
            'due_date' => 'nullable|date',  // If due_date is provided, it must be a valid date
        ], [
            'status.in' => 'The status must be one of the following: pending, in_progress, completed.',
            'due_date.date' => 'The due date must be a valid date.'
        ]);

        // Update the task
        $task->title = $request->title;
        $task->status = $request->status;
        $task->due_date = $request->due_date; // Update due date if provided
        $task->updated_at = now();
        $task->save();

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ]);
    }

    /**
     * Delete a task
     */
    public function destroy(Request $request, $id)
    {
        // Find the task
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        // Delete the task
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
