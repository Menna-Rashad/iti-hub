<?php
namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    // إرسال الإشعار عبر قناة خاصة
    public function broadcastOn()
    {
        // **قناة عامة لجميع المستخدمين**: هنا يتم بث الإشعار لجميع المستخدمين عبر قناة `admin-news`.
        return new Channel('admin-news');
    }

    // تحديد البيانات التي سيتم بثها مع الإشعار
    public function broadcastWith()
    {
        return [
            'id' => $this->notification->id,
            'message' => $this->notification->message,
            'type' => $this->notification->type,
            'is_read' => $this->notification->is_read,
            'created_at' => $this->notification->created_at->toIso8601String(),
        ];
    }
}
