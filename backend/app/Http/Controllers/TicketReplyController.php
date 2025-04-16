<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketReplyController extends Controller
{
    public function store(Request $request, $ticketId)
    {
        $ticket = SupportTicket::findOrFail($ticketId);

        if ($ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string', // assuming they are file paths
        ]);

        $reply = TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'sender_type' => 'user',
            'message' => $validated['message'],
            'attachments' => isset($validated['attachments']) ? json_encode($validated['attachments']) : null,
        ]);

        return response()->json([
            'message' => 'Reply added successfully',
            'reply' => $reply
        ], 201);
    }
}
