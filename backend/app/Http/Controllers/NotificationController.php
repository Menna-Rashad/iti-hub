<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;
use App\Models\SupportTicket;
use App\Events\NotificationSent;

class NotificationController extends Controller
{
    /**
     * عرض جميع الإشعارات الخاصة بالمستخدم.
     */
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
                                     ->orderBy('created_at', 'desc')
                                     ->get();

        $notificationsArray = $notifications->toArray();
        
        return response()->json([
            'notifications' => array_map(function ($notification) {
                return [
                    'id' => $notification['id'],
                    'type' => $notification['type'],
                    'message' => $notification['message'],
                    'is_read' => $notification['is_read'],
                    'created_at' => optional($notification['created_at'])->toIso8601String(),
                ];
            }, $notificationsArray),
        ]);
    }

    /**
     * إرسال إشعار لجميع المستخدمين عند إضافة خبر.
     */
    public function sendNewsNotification(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. You are not an admin.'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'type' => 'required|string',
            'related_id' => 'nullable|integer',
            'related_type' => 'nullable|string',
        ]);

        $message = $validated['message'];
        $type = $validated['type'];
        $related_id = $validated['related_id'];
        $related_type = $validated['related_type'];

        $users = User::all();
        $responseNotifications = [];

        foreach ($users as $user) {
            $notification = Notification::create([
                'user_id' => $user->id,
                'sender_id' => $request->user()->id,
                'message' => $message,
                'type' => $type,
                'related_id' => $related_id,
                'related_type' => $related_type,
                'is_read' => false,
            ]);

            $responseNotifications[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'is_read' => $notification->is_read,
                'created_at' => optional($notification->created_at)->toIso8601String(),
            ];

            event(new NotificationSent($notification));
        }

        return response()->json($responseNotifications);
    }

    /**
     * إرسال إشعار للمستخدم عند الرد على التذكرة.
     */
    public function sendReplyNotification(Request $request, $ticketId)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. You are not an admin.'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'ticket_id' => 'required|integer|exists:support_tickets,id',
        ]);

        $ticket = SupportTicket::findOrFail($validated['ticket_id']);
        $message = $validated['message'];

        $notification = Notification::create([
            'user_id' => $ticket->user_id,
            'sender_id' => $request->user()->id,
            'message' => 'An admin has replied to your support ticket #' . $ticket->id,
            'type' => 'ticket_reply',
            'related_id' => $ticket->id,
            'related_type' => 'ticket',
            'is_read' => false,
        ]);

        event(new NotificationSent($notification));

        return response()->json([
            'message' => 'Notification sent successfully.',
            'notification' => [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'is_read' => $notification->is_read,
                'created_at' => optional($notification->created_at)->toIso8601String(),
            ]
        ]);
    }

    /**
     * حذف إشعار معين للمستخدم.
     */
    public function destroy(Request $request, $notificationId)
    {
        $notification = Notification::where('id', $notificationId)
                                    ->where('user_id', $request->user()->id)
                                    ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found or you are not authorized to delete it.'], 404);
        }

        $responseNotification = [
            'id' => $notification->id,
            'type' => $notification->type,
            'message' => $notification->message,
            'is_read' => $notification->is_read,
            'created_at' => optional($notification->created_at)->toIso8601String(),
        ];

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully.',
            'notification' => $responseNotification
        ]);
    }

    /**
     * تحديث حالة قراءة إشعار معين.
     */
    public function markAsRead(Request $request, $notificationId)
    {
        $notification = Notification::where('id', $notificationId)
                                    ->where('user_id', $request->user()->id)
                                    ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found or you are not authorized to mark it as read.'], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'message' => 'Notification marked as read successfully.',
            'notification' => [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'is_read' => $notification->is_read,
                'created_at' => optional($notification->created_at)->toIso8601String(),
            ]
        ]);
    }

    /**
     * تحديث حالة قراءة جميع الإشعارات للمستخدم.
     */
    public function markAllAsRead(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
                                     ->where('is_read', false)
                                     ->update(['is_read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read successfully.',
            'count' => $notifications,
        ]);
    }
}