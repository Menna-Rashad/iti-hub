<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketReply extends Model
{
    protected $fillable = [
        'support_ticket_id',
        'sender_type',
        'message',
        'attachments',
    ];
    
    protected $casts = [
        'attachments' => 'array',
    ];
    
    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }
}
