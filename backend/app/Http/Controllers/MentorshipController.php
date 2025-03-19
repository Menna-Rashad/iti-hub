<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MentorshipSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\MentorshipMaterial;
use Illuminate\Support\Facades\Storage;
use Firebase\JWT\JWT;
class MentorshipController extends Controller
{
    // دالة لإنشاء الجلسة بواسطة الموجه
    public function createMentorship(Request $request)
    {
        try {
            $validated = $request->validate([
                'mentor_id' => 'required|exists:users,id',
                'session_title' => 'required|string',
                'session_date' => 'required|date_format:Y-m-d H:i:s',
                'platform' => 'required|in:Zoom,Google Meet,Teams',
            ]);
    
            // Creating the session in the database
            $mentorship = MentorshipSession::create([
                'mentor_id' => $request->mentor_id,
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
    
    
    // دالة لعرض الجلسات المتاحة للمستخدمين
    public function getAvailableMentorships()
    {
        $mentorships = MentorshipSession::whereNull('mentee_id')->get();
        return response()->json($mentorships);
    }

    // دالة لتحديد اهتمام المستخدم بالجلسة
    public function setInterestStatus(Request $request, $mentorship_id)
{
    // تحقق من صحة البيانات المدخلة
    $validated = $request->validate([
        'interest_status' => 'required|in:interested,attending,not_interested',
    ]);
    
    try {
        // العثور على الجلسة
        $mentorship = MentorshipSession::findOrFail($mentorship_id);

        // التحقق مما إذا كان المستخدم قد حجز الجلسة مسبقًا
        $userExists = $mentorship->users()->where('user_id', Auth::id())->exists();

        // إذا كان المستخدم قد حجز الجلسة مسبقًا، لا نسمح بتحديث الاهتمام
        if ($userExists) {
            return response()->json(['message' => 'You have already booked this mentorship.'], 400);
        }

        // إضافة المستخدم إلى الجلسة مع تحديد حالة الاهتمام
        $mentorship->users()->attach(Auth::id(), ['interest_status' => $request->interest_status]);

        return response()->json(['message' => 'Interest status updated successfully!', 'mentorship' => $mentorship], 200);
    } catch (\Exception $e) {
        // تسجيل الخطأ في السجلات
        Log::error("Error updating interest status: " . $e->getMessage());
        return response()->json(['message' => 'Failed to update interest status.'], 500);
    }
}


    // دالة لانضمام المستخدم إلى الجلسة
    public function markAsAttending($mentorship_id)
    {
        try {
            // البحث عن الجلسة
            $mentorship = MentorshipSession::findOrFail($mentorship_id);
    
            // تحقق من أن المستخدم قد قام بتحديد الجلسة على أنه "مهتم" أولاً
            $userInterest = $mentorship->users()->where('user_id', Auth::id())->first();
    
            if (!$userInterest || $userInterest->pivot->interest_status !== 'interested') {
                return response()->json(['message' => 'You must mark the mentorship as interested first.'], 400);
            }
    
            // تحديث interest_status في mentorship_user ليكون "attending"
            $mentorship->users()->updateExistingPivot(Auth::id(), ['interest_status' => 'attending']);
    
            // تحديث mentee_id في mentorship_sessions لتحديد أن المستخدم قد أصبح الحاضر
            $mentorship->update(['mentee_id' => Auth::id()]);
    
            return response()->json(['message' => 'Mentorship marked as attending successfully!', 'mentorship' => $mentorship], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to mark as attending.'], 500);
        }
    }
    
    public function deleteSession($mentorship_id)
{
    try {
        $mentorship = MentorshipSession::findOrFail($mentorship_id);

        // Ensure that only the mentor who created the session can delete it
        if ($mentorship->mentor_id != Auth::id()) {
            return response()->json(['message' => 'Only the mentor can delete this session.'], 403);
        }

        // Hard delete from database
        $mentorship->delete();

        return response()->json(['message' => 'Session deleted successfully!'], 200);
    } catch (\Exception $e) {
        Log::error("Error deleting mentorship session: " . $e->getMessage());
        return response()->json(['message' => 'Failed to delete the session.'], 500);
    }
}

    
    
    

    // دالة لإلغاء الجلسة
    public function cancelMentorship($mentorship_id)
{
    try {
        // Find the mentorship session
        $mentorship = MentorshipSession::findOrFail($mentorship_id);

        // Check if the current user is the mentor
        if ($mentorship->mentor_id != Auth::id()) {
            return response()->json(['message' => 'Only the mentor can cancel the mentorship.'], 403);
        }

        // Change the session status to 'cancelled'
        $mentorship->update(['session_status' => 'cancelled']);
        return response()->json(['message' => 'Mentorship cancelled successfully!'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to cancel the mentorship.'], 500);
    }
}

    
    public function getMentorSessions()
    {
        $mentorId = Auth::id(); // Get logged-in mentor
        Log::info("📡 Fetching sessions for mentor ID:", [$mentorId]);
    
        try {
            $sessions = MentorshipSession::where('mentor_id', $mentorId)->get();
    
            if ($sessions->isEmpty()) {
                return response()->json(["message" => "No sessions found.", "data" => []], 200);
            }
    
            return response()->json($sessions, 200);
        } catch (\Exception $e) {
            Log::error("❌ Error fetching mentor sessions: " . $e->getMessage());
            return response()->json(["message" => "Failed to fetch sessions."], 500);
        }
    }
    


    // دالة لتقييم الجلسة
    public function rateMentorship(Request $request, $mentorship_id)
{
    // تحقق من البيانات المدخلة وتأكد من صحة التقييم
    $validated = $request->validate([
        'mentor_rating' => 'required|integer|min:1|max:5', // يجب أن يكون التقييم بين 1 و 5
        'mentee_feedback' => 'nullable|string', // التعليقات يمكن أن تكون فارغة
    ]);

    try {
        // البحث عن الجلسة باستخدام ID الجلسة
        $mentorship = MentorshipSession::findOrFail($mentorship_id);

        // التأكد من أن المستخدم قد حضر الجلسة لكي يتمكن من التقييم
        $userInterestStatus = $mentorship->users()->where('user_id', Auth::id())->first()->pivot->interest_status;

        if ($userInterestStatus != 'attending') {
            return response()->json(['message' => 'You can only rate mentorships you have attended.'], 400);
        }

        // تحديث تقييم الموجه وتعليقات المتدرب
        $mentorship->update([
            'mentor_rating' => $request->mentor_rating, // تحديث التقييم
            'mentee_feedback' => $request->mentee_feedback, // تحديث الملاحظات
        ]);

        return response()->json(['message' => 'Mentorship rated successfully!'], 200);
    } catch (\Exception $e) {
        // تسجيل الخطأ في السجلات إذا حدث
        Log::error("Error rating mentorship: " . $e->getMessage());
        return response()->json(['message' => 'Failed to rate the mentorship.'], 500);
    }
}
public function giveFeedback(Request $request, $mentorship_id)
{
    // Validate input data
    $validated = $request->validate([
        'feedback' => 'nullable|string',
        'rating' => 'nullable|integer|min:1|max:5',
    ]);

    try {
        // Find the mentorship session and the authenticated user
        $mentorship = MentorshipSession::findOrFail($mentorship_id);
        $user = Auth::user();

        // Check if the user is associated with this mentorship session
        $userSession = $mentorship->users()->where('user_id', $user->id)->first();

        if (!$userSession) {
            return response()->json(['message' => 'User is not associated with this session.'], 400);
        }

        // Update the feedback and rating
        $userSession->pivot->update([
            'feedback' => $request->feedback,
            'rating' => $request->rating,
        ]);

        return response()->json(['message' => 'Feedback and rating successfully submitted!'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to submit feedback.'], 500);
    }
}
// public function uploadMaterial(Request $request, $mentorship_id)
// {
//     // Validate the file
//     $request->validate([
//         'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx|max:10240', // Adjust max file size as needed
//     ]);

//     try {
//         // Handle file upload
//         $file = $request->file('file');

//         // Store the file in the public directory (you can also create a 'materials' folder if needed)
//         $filePath = $file->storeAs('public/mentorship_materials', $file->getClientOriginalName());

//         // Save file information to the database
//         $material = new MentorshipMaterial();
//         $material->mentorship_session_id = $mentorship_id;
//         $material->file_name = $file->getClientOriginalName();
//         $material->file_path = $filePath;  // Store the path in the database
//         $material->save();

//         return response()->json(['message' => 'Material uploaded successfully!'], 200);

//     } catch (\Exception $e) {
//         return response()->json(['message' => 'Failed to upload material. Please try again later.'], 500);
//     }
// }

// public function downloadMaterial($material_id)
// {
//     try {
//         $material = MentorshipMaterial::findOrFail($material_id);

//         // Check if the file exists
//         if (!Storage::disk('public')->exists($material->file_path)) {
//             return response()->json(['message' => 'File not found.'], 404);
//         }

//         // Return the file for download
//         return response()->download(storage_path('app/public/' . $material->file_path), $material->file_name);
//     } catch (\Exception $e) {
//         return response()->json(['message' => 'Failed to download material.'], 500);
//     }
// }

    
}
