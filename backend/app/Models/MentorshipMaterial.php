<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentorship_session_id',
        'file_path',
        'file_name',
    ];

    public function mentorshipSession()
    {
        return $this->belongsTo(MentorshipSession::class, 'mentorship_session_id');
    }
}
