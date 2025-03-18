<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MentorshipSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MentorshipController extends Controller
{
    // 🟢 Book a new session
    public function bookSession(Request $request)
    {
        // Validate input data
        $validated = $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'session_date' => 'required|date_format:Y-m-d H:i:s',
            'platform' => 'required|in:Zoom,Google Meet,Teams',
        ]);

        // Ensure that the mentee is not booking a session with themselves
        if ($request->mentor_id == Auth::id()) {
            return response()->json(['message' => 'You cannot book a session with yourself!'], 400);
        }

        // Create the session
        try {
            $session = MentorshipSession::create([
                'mentor_id' => $request->mentor_id,
                'mentee_id' => Auth::id(),
                'session_date' => $request->session_date,
                'platform' => $request->platform,
            ]);

            // Log the session booking
            Log::info('Session booked', ['session' => $session]);

            return response()->json([
                'message' => 'Session booked successfully!',
                'session' => $session
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to book the session. Please try again later.'], 500);
        }
    }

    // 🟢 Get user sessions
    public function getUserSessions()
    {
        $sessions = MentorshipSession::where('mentee_id', Auth::id())
            ->orWhere('mentor_id', Auth::id())
            ->get();

        return response()->json($sessions);
    }

    // 🟢 Cancel the session
    public function cancelSession($id)
    {
        try {
            $session = MentorshipSession::findOrFail($id);

            // Validate that the session is in 'scheduled' status
            if ($session->session_status !== 'scheduled') {
                return response()->json(['message' => 'This session cannot be canceled because it is not scheduled.'], 400);
            }

            $session->update(['session_status' => 'cancelled']);

            // Log the cancellation
            Log::info('Session cancelled', ['session_id' => $id]);

            return response()->json(['message' => 'Session cancelled successfully']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to cancel the session. Please try again later.'], 500);
        }
    }
// 🟠 Delete a mentorship session
public function deleteSession($id)
{
    $session = MentorshipSession::findOrFail($id);
    
    // Check if the session belongs to the current user (either mentee or mentor)
    if ($session->mentee_id != Auth::id() && $session->mentor_id != Auth::id()) {
        return response()->json(['message' => 'Unauthorized action'], 403);
    }

    $session->delete();  // Delete the session

    return response()->json(['message' => 'Session deleted successfully']);
}

    // 🟢 Rate the session
    public function rateSession(Request $request, $id)
    {
        // Validate rating and feedback
        $validated = $request->validate([
            'mentor_rating' => 'required|integer|min:1|max:5',
            'mentee_feedback' => 'nullable|string',
        ]);

        try {
            $session = MentorshipSession::findOrFail($id);

            // Check if the session status is 'completed' before rating
            if ($session->session_status !== 'completed') {
                return response()->json(['message' => 'You can only rate completed sessions.'], 400);
            }

            // Update the session with the rating and feedback
            $session->update([
                'mentor_rating' => $request->mentor_rating,
                'mentee_feedback' => $request->mentee_feedback,
            ]);

            // Log the rating
            Log::info('Session rated', ['session_id' => $id, 'rating' => $request->mentor_rating]);

            return response()->json(['message' => 'Session rated successfully']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to rate the session. Please try again later.'], 500);
        }
    }
}
