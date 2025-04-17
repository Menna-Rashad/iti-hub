<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketReplyAdminController extends Controller
{
    public function store(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
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
}
