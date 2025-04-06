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
        'mentee_id',  // Added mentee_id
        'session_title',
        'session_date',
        'platform',
        'session_status', // Added status instead of interest_status
        'mentor_rating',
        'mentee_feedback',
    ];
    

    // Relationship with mentor (User)
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    // Relationship with mentee (User)
    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    // Relationship with users (many-to-many)
    public function users()
    {
        return $this->belongsToMany(User::class, 'mentorship_user', 'mentorship_session_id', 'user_id')
            ->withPivot('interest_status');  // Defines the interest status in the pivot table
    }
}
