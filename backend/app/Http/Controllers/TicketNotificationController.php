<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\TicketNotification;

class TicketNotificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            \Log::info('ticket-notifications index called by user: ' . Auth::id());
    
            $user = Auth::user();
            $query = $user->ticketNotifications();
    
            if ($request->has('read')) {
                $isRead = $request->query('read') == 1 ? 1 : 0;
                $query->where('is_read', $isRead);
            }
    
            $notifications = $query->latest()->get();
    
            return response()->json($notifications);
        } catch (\Throwable $e) {
            \Log::error('Error in TicketNotificationController@index: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
        
    public function markAsRead($id)
{
    $notification = TicketNotification::where('id', $id)
        ->where('user_id', Auth::id())
        ->firstOrFail();

    $notification->update(['is_read' => true]);

    return response()->json(['message' => 'Notification marked as read']);
}

public function markAllAsRead()
{
    TicketNotification::where('user_id', Auth::id())
        ->where('is_read', false)
        ->update(['is_read' => true]);

    return response()->json(['message' => 'All notifications marked as read']);
}
public function countUnread()
{
    $user = Auth::user();

    $count = $user->ticketNotifications()->where('is_read', false)->count();

    return response()->json(['unread_count' => $count]);
}

}
