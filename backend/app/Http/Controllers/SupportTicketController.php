<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = SupportTicket::with('user');
    
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
    
        $tickets = $query->latest()->get();
    
        return response()->json([
            'tickets' => $tickets
        ]);
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
            ]);
    
            $ticket = SupportTicket::create(array_merge(
                ['user_id' => $userId],
                $validated
            ));            
    
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
    
        if (Auth::user()->role !== 'admin' && $ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $ticket->replies->each(function ($reply) {
            if ($reply->attachments) {
                $reply->attachments = collect($reply->attachments)->map(function ($file) {
                    return asset('storage/' . $file);
                });
            }
        });
    
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
