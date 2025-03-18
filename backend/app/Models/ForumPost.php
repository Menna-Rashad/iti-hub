<?php

namespace App\Models;
use App\Models\Comment;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ForumPost extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'content',
        'tags',
        'upvotes',
        'downvotes'
    ];

    // العلاقة مع المستخدم
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // العلاقة مع التعليقات
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    // أضف العلاقة مع التصويتات
    public function votes() {
        return $this->morphMany(Vote::class, 'votable');
    }
    // تحديث عدد التصويتات
    public function refreshVoteCounts()
    {
        $this->update([
            'upvotes' => $this->votes()->where('vote_type', 'upvote')->count(),
            'downvotes' => $this->votes()->where('vote_type', 'downvote')->count()
        ]);
    }

    // العلاقة مع الفئة
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

}