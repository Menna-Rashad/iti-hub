<?php

namespace App\Models;

use App\Models\ForumPost;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'national_id',
        'role',
        'profile_picture',
        'bio',
        'linkedin',
        'github',
        'is_verified',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verification_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_verified' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function forumPosts()
    {
        return $this->hasMany(ForumPost::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function badges()
    {
        return $this->hasMany(Badge::class);
    }

    public function points()
    {
        return $this->hasOne(Points::class);
    }

    public function ticketNotifications()
    {
        return $this->hasMany(TicketNotification::class);
    }
    public function supportTickets()
{
    return $this->hasMany(\App\Models\SupportTicket::class);
}
public function followers()
{
    return $this->belongsToMany(User::class, 'follows', 'followed_id', 'follower_id');
}

public function following()
{
    return $this->belongsToMany(User::class, 'follows', 'follower_id', 'followed_id');
}


}