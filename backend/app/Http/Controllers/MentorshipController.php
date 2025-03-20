<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MentorshipSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MentorshipController extends Controller
{
    // ==============================
    // 🔵 Mentor-Specific Functions
    // ==============================

    /**
     * Create a new mentorship session (Mentor only)
     */
    public function createMentorship(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Only mentors can create a session.'], 403);
        }

        $validated = Validator::make($request->all(), [
            'session_title' => 'required|string',
            'session_date' => 'required|date_format:Y-m-d H:i:s',
            'platform' => 'required|in:Zoom,Google Meet,Teams',
        ]);

        if ($validated->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validated->errors()], 422);
        }

        try {
            $mentorship = MentorshipSession::create([
                'mentor_id' => $user->id,
                'session_title' => $request->session_title,
                'session_date' => $request->session_date,
                'platform' => $request->platform,
                'session_status' => 'scheduled',
            ]);

            return response()->json(['message' => 'Mentorship session created successfully!', 'mentorship' => $mentorship], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create mentorship session.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all sessions for the mentor
     */
    public function getMentorSessions()
    {
        try {
            $sessions = MentorshipSession::where('mentor_id', Auth::id())->get();
            return response()->json($sessions, 200);
        } catch (\Exception $e) {
            Log::error("Error fetching mentor sessions: " . $e->getMessage());
            return response()->json(["message" => "Failed to fetch sessions."], 500);
        }
    }

    /**
     * Cancel a mentorship session (Mentor only)
     */
    public function cancelMentorship($mentorship_id)
    {
        try {
            $mentorship = MentorshipSession::findOrFail($mentorship_id);

            if ($mentorship->mentor_id != Auth::id()) {
                return response()->json(['message' => 'Only the mentor can cancel the mentorship.'], 403);
            }

            $mentorship->update(['session_status' => 'cancelled']);
            return response()->json(['message' => 'Mentorship cancelled successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to cancel the mentorship.'], 500);
        }
    }

    /**
     * Delete a session (Mentor only)
     */
    public function deleteSession($mentorship_id)
    {
        try {
            $mentorship = MentorshipSession::findOrFail($mentorship_id);

            if ($mentorship->mentor_id != Auth::id()) {
                return response()->json(['message' => 'Only the mentor can delete this session.'], 403);
            }

            $mentorship->delete();
            return response()->json(['message' => 'Session deleted successfully!'], 200);
        } catch (\Exception $e) {
            Log::error("Error deleting mentorship session: " . $e->getMessage());
            return response()->json(['message' => 'Failed to delete the session.'], 500);
        }
    }

    // ==============================
    // 🟢 User-Specific Functions
    // ==============================

    /**
     * Fetch available mentorship sessions for users
     */
    public function getAvailableMentorships()
    {
        return response()->json(MentorshipSession::whereNull('mentee_id')->get());
    }

    /**
     * Mark user interest in a session
     */
    public function setInterestStatus(Request $request, $mentorship_id)
{
    $validated = $request->validate([
        'interest_status' => 'required|in:interested,not_interested',
    ]);

    try {
        $mentorship = MentorshipSession::findOrFail($mentorship_id);

        // Update interest status in the pivot table (many-to-many relation)
        $mentorship->users()->syncWithoutDetaching([
            Auth::id() => ['interest_status' => $validated['interest_status']]
        ]);

        // If the user is interested, update the userSessions list
        if ($validated['interest_status'] === 'interested') {
            $mentorship->mentee_id = Auth::id();
            $mentorship->save();
        }

        return response()->json(['message' => 'Interest status updated successfully!'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to update interest status.', 'error' => $e->getMessage()], 500);
    }
}

    /**
     * Mark user as attending a session
     */
    public function markAsAttending($mentorship_id)
    {
        try {
            $mentorship = MentorshipSession::findOrFail($mentorship_id);
            $mentorship->update(['mentee_id' => Auth::id()]);

            return response()->json(['message' => 'Marked as attending successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to mark as attending.'], 500);
        }
    }

    /**
     * Fetch sessions for a user (mentor or mentee)
     */
    public function getUserSessions()
    {
        try {
            $user = Auth::user();
            $sessions = MentorshipSession::where('mentee_id', $user->id)
                ->orWhere('mentor_id', $user->id)
                ->get();
            return response()->json($sessions, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching user sessions: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch sessions.'], 500);
        }
    }

    /**
     * Rate a mentorship session
     */
    public function rateMentorship(Request $request, $mentorship_id)
    {
        $validated = Validator::make($request->all(), [
            'mentor_rating' => 'required|integer|min:1|max:5',
            'mentee_feedback' => 'nullable|string',
        ]);

        if ($validated->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validated->errors()], 422);
        }

        try {
            $mentorship = MentorshipSession::findOrFail($mentorship_id);
            $mentorship->update([
                'mentor_rating' => $request->mentor_rating,
                'mentee_feedback' => $request->mentee_feedback,
            ]);

            return response()->json(['message' => 'Mentorship rated successfully!'], 200);
        } catch (\Exception $e) {
            Log::error("Error rating mentorship: " . $e->getMessage());
            return response()->json(['message' => 'Failed to rate the mentorship.'], 500);
        }
    }

    /**
     * Submit feedback on a mentorship session
     */
    public function giveFeedback(Request $request, $mentorship_id)
    {
        $validated = Validator::make($request->all(), [
            'feedback' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validated->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validated->errors()], 422);
        }

        try {
            $mentorship = MentorshipSession::findOrFail($mentorship_id);
            $mentorship->update([
                'feedback' => $request->feedback,
                'rating' => $request->rating,
            ]);

            return response()->json(['message' => 'Feedback submitted successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to submit feedback.'], 500);
        }
    }
}
