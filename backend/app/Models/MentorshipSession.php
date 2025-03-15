<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentor_id',
        'mentee_id',
        'session_date',
        'session_status',
        'platform',
        'mentor_rating',
        'mentee_feedback',
    ];

    // العلاقة مع المستخدمين
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }
}
