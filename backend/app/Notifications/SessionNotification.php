<?php

namespace App\Notifications;

use App\Models\MentorshipSession;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SessionNotification extends Notification
{
    use Queueable;

    public $session;

    public function __construct(MentorshipSession $session)
    {
        $this->session = $session;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];  // إرسال عبر قاعدة البيانات والبريد الإلكتروني
    }

    public function toDatabase($notifiable)
    {
        return [
            'session_title' => $this->session->session_title,
            'session_date' => $this->session->session_date,
            'platform' => $this->session->platform,
            'session_id' => $this->session->id,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('A new mentorship session has been created.')
                    ->action('View Session', url('/sessions/'.$this->session->id))
                    ->line('Session Title: ' . $this->session->session_title);
    }
}
 