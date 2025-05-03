<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use Illuminate\Support\Facades\Auth;


class SupportTicketAdminController extends Controller
{
    public function index(Request $request)
{
    if (Auth::user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $query = SupportTicket::with('user')->latest();

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return response()->json($query->get());
}
public function show($id)
{
    $ticket = SupportTicket::with('replies', 'user')->findOrFail($id);

    if (Auth::user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    return response()->json([
        'ticket' => $ticket,
        'replies' => $ticket->replies
    ]);
}
public function replyToSupportTicket(Request $request, $ticketId)
{
    if (Auth::user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $ticket = SupportTicket::findOrFail($ticketId);

    // Validate and process the reply message and attachments
    $reply = $ticket->replies()->create([
        'sender_type' => 'admin',
        'message' => $request->message,
        // Process attachments
    ]);

    // Save attachments
    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            // Store the file and attach it to the reply
            $path = $file->store('ticket_attachments');
            $reply->attachments()->create(['file_path' => $path]);
        }
    }

    return response()->json([
        'message' => 'Reply sent successfully',
        'reply' => $reply->load('attachments') // Load the attached files
    ]);
}


}
