<?php

namespace App\Models;

// use App\Models\ForumPost;
// use App\Models\Comment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
// use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    protected $fillable = [
        'user_id',
        'vote_type',
        'votable_id',
        'votable_type'
    ];

    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    // }

    // public function post(): BelongsTo
    // {
    //     return $this->belongsTo(ForumPost::class, 'forum_post_id');
    // }

    // public function comment(): BelongsTo
    // {
    //     return $this->belongsTo(Comment::class);
    // }
    
    public function votable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}