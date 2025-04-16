<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SupportTicketReplyController extends Controller
{
    public function store(Request $request, $id)
{
    $ticket = SupportTicket::findOrFail($id);

    $request->validate([
        'message' => 'nullable|string',
        'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,txt,doc,docx|max:20480',
    ]);

    \Log::info('Incoming request:', $request->all());

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
    

    \Log::info('Upload paths:', ['paths' => $paths]);

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

}
