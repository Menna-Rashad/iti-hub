<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipSession extends Model
{
    use HasFactory;

    protected $table = 'mentorship_sessions';

    protected $fillable = [
        'mentor_id',
        'mentee_id',
        'session_title',
        'session_date',
        'platform',
        'session_status', // تم إضافة هذه الحالة بدلًا من interest_status
        'mentor_rating',
        'mentee_feedback',
    ];

    // علاقة مع الموجه (User)
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    // علاقة مع المتدرب (User)
    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    // علاقة مع المستخدمين (عديد إلى العديد)
    public function users()
    {
        return $this->belongsToMany(User::class, 'mentorship_user', 'mentorship_session_id', 'user_id')
            ->withPivot('interest_status');  // يحدد حالة الاهتمام في جدول الارتباط
    }
}
