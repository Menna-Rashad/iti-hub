<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MentorshipSession;
use Illuminate\Support\Facades\Auth;

class MentorshipController extends Controller
{
    // 🟢 حجز جلسة جديدة
    public function bookSession(Request $request)
{
    // التحقق من صحة البيانات
    $request->validate([
        'mentor_id' => 'required|exists:users,id',
        'session_date' => 'required|date_format:Y-m-d H:i:s',
        'platform' => 'required|in:Zoom,Google Meet,Teams',
    ]);

    // إنشاء الجلسة
    $session = MentorshipSession::create([
        'mentor_id' => $request->mentor_id,
        'mentee_id' => Auth::id(),
        'session_date' => $request->session_date,
        'platform' => $request->platform,
    ]);

    return response()->json([
        'message' => 'تم حجز الجلسة بنجاح!',
        'session' => $session
    ], 201);
}

    // 🟢 استعراض الجلسات الخاصة بالمستخدم
    public function getUserSessions()
    {
        $sessions = MentorshipSession::where('mentee_id', Auth::id())
            ->orWhere('mentor_id', Auth::id())
            ->get();

        return response()->json($sessions);
    }

    // 🟢 إلغاء الجلسة
    public function cancelSession($id)
    {
        $session = MentorshipSession::findOrFail($id);
        $session->update(['session_status' => 'cancelled']);

        return response()->json(['message' => 'تم إلغاء الجلسة بنجاح']);
    }

    // 🟢 تقييم الجلسة
    public function rateSession(Request $request, $id)
    {
        $request->validate([
            'mentor_rating' => 'required|integer|min:1|max:5',
            'mentee_feedback' => 'nullable|string',
        ]);

        $session = MentorshipSession::findOrFail($id);
        $session->update([
            'mentor_rating' => $request->mentor_rating,
            'mentee_feedback' => $request->mentee_feedback,
        ]);

        return response()->json(['message' => 'تم تقييم الجلسة بنجاح']);
    }
}
