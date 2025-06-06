<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
    
        if ($user->role === 'admin') {
            return SupportTicket::with('user')->latest()->get();
        }
    
        return SupportTicket::with('replies')->where('user_id', $user->id)->latest()->get();
    }
    
    

    public function store(Request $request)
    {
        \Log::info('Auth ID:', ['id' => Auth::id()]);
        try {
            $userId = Auth::id();
    
            if (!$userId) {
                return response()->json(['message' => 'Not Authenticated'], 401);
            }
    
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'required|in:low,medium,high',
                'category' => 'nullable|string|max:100',
                'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048' // ✅ دعم المرفقات
            ]);
    
            $ticket = SupportTicket::create([
                'user_id' => $userId,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'priority' => $validated['priority'],
                'category' => $validated['category'] ?? null,
            ]);
    
            // ✅ لو فيه مرفقات
            if ($request->hasFile('attachments')) {
                $paths = [];
                foreach ($request->file('attachments') as $file) {
                    $paths[] = $file->store('support_attachments', 'public');
                }
                // ضيف المرفقات في التذكرة (لو عامل لهم عمود attachments)
                $ticket->attachments = $paths;
                $ticket->save();
            }
    
            return response()->json([
                'message' => 'Ticket created successfully',
                'ticket' => $ticket
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'msg' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    
    

    public function show($id)
    {
        $ticket = SupportTicket::with('replies')->findOrFail($id);
    
        $user = auth()->user();
    
        if (!$user || ($user->role !== 'admin' && $ticket->user_id !== $user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Format reply attachments
        $ticket->replies->each(function ($reply) {
            if ($reply->attachments) {
                $reply->attachments = collect($reply->attachments)->map(function ($file) {
                    return asset('storage/' . $file);
                });
            }
        });
    
        // Format ticket attachments
        if ($ticket->attachments) {
            $ticket->attachments = collect($ticket->attachments)->map(function ($file) {
                return asset('storage/' . $file);
            });
        }
    
        return response()->json([
            'ticket' => $ticket,
            'replies' => $ticket->replies
        ]);
    }
    
    
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:open,in_review,closed',
    ]);

    $ticket = SupportTicket::findOrFail($id);
    $ticket->status = $request->status;
    $ticket->save();

    return response()->json([
        'message' => 'Ticket status updated successfully.',
        'ticket' => $ticket,
    ]);
}
public function updateTicket(Request $request, $id)
{
    $ticket = SupportTicket::findOrFail($id);

    $request->validate([
        'priority' => 'nullable|in:low,medium,high',
        'category' => 'nullable|string|max:100',
    ]);

    $ticket->update($request->only(['priority', 'category']));

    return response()->json([
        'message' => 'Ticket updated successfully',
        'ticket' => $ticket
    ]);
}
public function destroy($id)
{
    $user = auth()->user();

    if (!$user || $user->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $ticket = SupportTicket::findOrFail($id);

    // Delete all related replies & their attachments (optional)
    foreach ($ticket->replies as $reply) {
        if (is_array($reply->attachments)) {
            foreach ($reply->attachments as $path) {
                \Storage::disk('public')->delete($path);
            }
        }
        $reply->delete();
    }

    $ticket->delete();

    return response()->json(['message' => 'Support ticket deleted successfully']);
}

}
