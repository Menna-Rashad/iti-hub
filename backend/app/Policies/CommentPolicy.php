<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Comment;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
    public function update(User $user, Comment $comment)
    {
        return $user->id === $comment->user_id 
            ? Response::allow()
            : Response::deny('ليس لديك صلاحية تعديل هذا التعليق');
    }

    public function delete(User $user, Comment $comment)
    {
        return $user->id === $comment->user_id || $user->isAdmin();
    }
}
