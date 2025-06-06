<?php

namespace App\Models;

use App\Models\ForumPost;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'post_id',
        'content',
        'parent_comment_id',
        'upvotes',
        'downvotes',
        'is_flagged'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(ForumPost::class, 'post_id');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function refreshVoteCounts(): void
    {
        $this->update([
            'upvotes' => $this->votes()->where('vote_type', 'upvote')->count(),
            'downvotes' => $this->votes()->where('vote_type', 'downvote')->count()
        ]);
    }

    public function currentUserVote()
{
    return $this->morphOne(Vote::class, 'votable')->where('user_id', auth()->id());
}

}
