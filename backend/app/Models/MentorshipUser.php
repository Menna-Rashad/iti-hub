<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipUser extends Model
{
    use HasFactory;

    protected $table = 'mentorship_user'; // لو الجدول مش plural

    protected $fillable = [
        'mentorship_session_id',
        'user_id',
        'interest_status',
        'feedback',
        'rating',
        // أي أعمدة تانية موجودة
    ];
}
