<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'priority',
        'status',
        'category',
        'attachments' 
    ];
    protected $casts = [
        'attachments' => 'array' // ✅ مهم جدا عشان Laravel يعرف يتعامل مع JSON صح
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }
}
