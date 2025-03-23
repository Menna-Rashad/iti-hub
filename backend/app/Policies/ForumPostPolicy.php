<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ForumPost;
use Illuminate\Auth\Access\Response;

class ForumPostPolicy
{
    public function update(User $user, ForumPost $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, ForumPost $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }
}
