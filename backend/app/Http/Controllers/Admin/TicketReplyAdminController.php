<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use App\Models\Notification; // استيراد موديل Notification
use App\Events\NotificationSent; // استيراد الـ Event
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\AdminLog;

class TicketReplyAdminController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $replies = TicketReply::with('ticket', 'ticket.user')->latest()->get();

        return response()->json($replies);
    }

    public function store(Request $request, $id)
    {
        try {
            if (auth()->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            \Log::info('Ticket ID: ' . $id);
            $ticket = SupportTicket::findOrFail($id);
            \Log::info('Ticket found: ' . json_encode($ticket));
        
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
        
            try {
                $reply = TicketReply::create([
                    'support_ticket_id' => $ticket->id,
                    'sender_type' => 'admin',
                    'message' => $request->input('message'),
                    'attachments' => $paths,
                ]);
                \Log::info('Reply created: ' . json_encode($reply));
            } catch (\Exception $e) {
                \Log::error('Failed to create reply: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to create reply',
                    'error' => $e->getMessage()
                ], 500);
            }
        
            \Log::info('Creating notification for user: ' . $ticket->user_id);
        
            try {
                $notification = Notification::create([
                    'user_id' => $ticket->user_id,
                    'sender_id' => auth()->id(),
                    'message' => 'An admin has replied to your support ticket #' . $ticket->id,
                    'type' => 'ticket_reply',
                    'related_id' => $ticket->id,
                    'related_type' => 'ticket',
                    'is_read' => false,
                ]);
        
                \Log::info('Notification created: ' . json_encode($notification));
        
                event(new NotificationSent($notification));
            } catch (\Exception $e) {
                \Log::error('Failed to create notification: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Reply added, but failed to create notification',
                    'error' => $e->getMessage()
                ], 500);
            }
        
            AdminLog::create([
                'admin_id' => auth()->id(),
                'action' => "Admin replied to support ticket ID: {$ticket->id}",
            ]);
            
            return response()->json([
                'message' => 'Admin reply added successfully',
                'reply' => $reply
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Unexpected error in store method: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reply = TicketReply::findOrFail($id);

        if (is_array($reply->attachments)) {
            foreach ($reply->attachments as $file) {
                Storage::disk('public')->delete($file);
            }
        }
        AdminLog::create([
            'admin_id' => auth()->id(),
            'action' => "Deleted ticket reply ID: {$id}",
        ]);
        
        $reply->delete();

        return response()->json(['message' => 'Reply deleted successfully']);
    }
}