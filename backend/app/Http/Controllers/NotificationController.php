<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;
use App\Events\NotificationSent;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

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

        return response()->json([
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'message' => $notification->message,
                    'is_read' => $notification->is_read,
                    'created_at' => optional($notification->created_at)->toIso8601String(),
                ];
            }),
        ]);
    }

    /**
     * تحديث حالة الإشعار إلى "مقروء".
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
                                    ->findOrFail($id);

        if (!$notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * تحديث جميع الإشعارات غير المقروءة إلى "مقروءة".
     */
    public function markAllAsRead(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
                             ->where('is_read', false)
                             ->update(['is_read' => true]);

        return response()->json(['message' => "$count notifications marked as read"]);
    }

    /**
     * إرجاع عدد الإشعارات غير المقروءة.
     */
    public function countUnread(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
                             ->where('is_read', false)
                             ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * إرسال إشعار لكل المستخدمين (للبوستات).
     */
    public function sendToAllUsers(Request $request, $message = null, $type = null, $related_id = null, $related_type = null)
    {
        // فحص إن المستخدم أدمن
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. You are not an admin.'], 403);
        }
    
        // Validation
        $validated = $request->validate([
            'message' => 'required|string',
            'type' => 'required|string',
            'related_id' => 'nullable|integer',
            'related_type' => 'nullable|string',
        ]);
    
        // استخدام القيم من الـ request بعد الـ validation
        $message = $validated['message'];
        $type = $validated['type'];
        $related_id = $validated['related_id'];
        $related_type = $validated['related_type'];
    
        $users = User::all();
        $notifications = [];
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
    
            $notifications[] = $notification;
            $responseNotifications[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'is_read' => $notification->is_read,
                'created_at' => optional($notification->created_at)->toIso8601String(),
            ];
    
            event(new NotificationSent($notification));
        }
    
        return $responseNotifications;
    }
    
    public function sendToSpecificUser(Request $request, $user_id = null, $message = null, $type = null, $related_id = null, $related_type = null)
    {
        // فحص إن المستخدم أدمن
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. You are not an admin.'], 403);
        }
    
        // Validation
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'message' => 'required|string',
            'type' => 'required|string',
            'related_id' => 'nullable|integer',
            'related_type' => 'nullable|string',
        ]);
    
        // استخدام القيم من الـ request بعد الـ validation
        $user_id = $validated['user_id'];
        $message = $validated['message'];
        $type = $validated['type'];
        $related_id = $validated['related_id'];
        $related_type = $validated['related_type'] ?? 'ticket';
    
        $notification = Notification::create([
            'user_id' => $user_id,
            'sender_id' => $request->user()->id,
            'message' => $message,
            'type' => $type,
            'related_id' => $related_id,
            'related_type' => $related_type,
            'is_read' => false,
        ]);
    
        $responseNotification = [
            'id' => $notification->id,
            'type' => $notification->type,
            'message' => $notification->message,
            'is_read' => $notification->is_read,
            'created_at' => optional($notification->created_at)->toIso8601String(),
        ];
    
        event(new NotificationSent($notification));
    
        return $responseNotification;
    }

    /**
     * مسح جميع الإشعارات الخاصة بالمستخدم.
     */
    public function clearAll(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => "$count notifications cleared successfully",
        ]);
    }

    /**
     * إرسال إشعار عبر Firebase.
     */
    public function sendNotification(Request $request)
    {
        $firebase = (new Factory)->withServiceAccount(storage_path('firebase-credentials.json'))->createMessaging();

        $message = CloudMessage::new()
            ->withNotification([
                'title' => $request->title,
                'body' => $request->message,
            ]);

        $firebase->send($message);

        return response()->json(['message' => 'Notification sent via Firebase']);
    }
}