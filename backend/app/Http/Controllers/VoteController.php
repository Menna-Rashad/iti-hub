<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\ForumPost;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    public function handleVote(Request $request)
    {
        $request->validate([
            'target_type' => 'required|in:post,comment',
            'target_id' => 'required|integer',
            'vote_type' => 'required|in:upvote,downvote'
        ]);

        $user = Auth::user();

        $model = $request->target_type === 'post'
            ? ForumPost::findOrFail($request->target_id)
            : Comment::findOrFail($request->target_id);

        $existingVote = Vote::where('user_id', $user->id)
            ->where('votable_id', $request->target_id)
            ->where('votable_type', get_class($model))
            ->first();

        if ($existingVote) {
            if ($existingVote->vote_type === $request->vote_type) {
                $existingVote->delete();
            } else {
                $existingVote->update(['vote_type' => $request->vote_type]);
            }
        } else {
            \Log::info('Voting on', [
                'user_id' => $user->id,
                'votable_type' => get_class($model),
                'votable_id' => $request->target_id,
            ]);

            Vote::create([
                'user_id' => $user->id,
                'votable_id' => $request->target_id,
                'votable_type' => get_class($model),
                'vote_type' => $request->vote_type
            ]);
        }

        $model->refreshVoteCounts();

        return response()->json([
            'upvotes' => $model->upvotes,
            'downvotes' => $model->downvotes
        ]);
    }
}
