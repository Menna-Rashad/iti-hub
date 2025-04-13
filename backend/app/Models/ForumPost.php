<?php

namespace App\Models;


// use App\Models\ForumPost;

use App\Models\Comment;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ForumPost extends Model
{
    protected $casts = [
        'media' => 'array',
    ];

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'content',
        'tags',
        'upvotes',
        'downvotes',
        'media'
    ];

    // public $casts
    // protected $casts = [
    //     'tags' => 'array',
    // ];
    
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id');
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function badges()
    {
        return $this->hasManyThrough(Badge::class, User::class, 'user_id', 'user_id');
    }
}
