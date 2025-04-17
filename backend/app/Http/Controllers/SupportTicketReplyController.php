<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SupportTicketReplyController extends Controller
{
    public function index($id)
{
    $ticket = SupportTicket::findOrFail($id);

    $replies = $ticket->replies()->orderBy('created_at')->get();

    return response()->json([
        'ticket_id' => $ticket->id,
        'replies' => $replies
    ]);
}

    public function store(Request $request, $id)
    {
        // ✅ هنا ما بنمنعش الأدمن، لأن المستخدم هو اللي هيستخدم الدالة دي
        $ticket = SupportTicket::findOrFail($id);
    
        $request->validate([
            'message' => 'nullable|string',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,txt,doc,docx|max:20480',
        ]);
    
        $paths = [];
        $files = $request->file('attachments');
    
        if ($files) {
            if (!is_array($files)) {
                $files = [$files]; 
            }
    
            foreach ($files as $file) {
                $paths[] = $file->store('ticket_attachments', 'public');
            }
        }
    
        $reply = TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'sender_type' => 'user',
            'message' => $request->input('message'),
            'attachments' => $paths,
        ]);
    
        return response()->json([
            'message' => 'Reply added successfully',
            'reply' => $reply
        ], 201);
    }

    public function adminReply(Request $request, $id)
{
    \Log::info('adminReply CALLED!');
\Log::info('User:', ['user' => Auth::user()]);
    logger('adminReply called');
    \Log::info('Admin Reply Triggered');
\Log::info('Auth Role: ' . Auth::user()->role);
\Log::info('Request Data:', $request->all());

    if (Auth::user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $ticket = SupportTicket::findOrFail($id);

    $request->validate([
        'message' => 'nullable|string',
        'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,txt,doc,docx|max:20480',
    ]);

    $paths = [];
    $files = $request->file('attachments');

    if ($files) {
        if (!is_array($files)) {
            $files = [$files]; 
        }

        foreach ($files as $file) {
            $paths[] = $file->store('ticket_attachments', 'public');
        }
    }

    $reply = TicketReply::create([
        'support_ticket_id' => $ticket->id,
        'sender_type' => 'admin',
        'message' => $request->input('message'),
        'attachments' => $paths,
    ]);

    return response()->json([
        'message' => 'Admin reply added successfully',
        'reply' => $reply
    ], 201);
}
public function destroy($id)
{
    $user = Auth::user();

    if (!$user || $user->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $reply = TicketReply::findOrFail($id);

    if (is_array($reply->attachments)) {
        foreach ($reply->attachments as $path) {
            \Storage::disk('public')->delete($path);
        }
    }

    $reply->delete();

    return response()->json(['message' => 'Reply deleted successfully.']);
}


}
