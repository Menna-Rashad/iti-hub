<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    // عرض جميع الـ Tracks
    public function index()
    {
        // الحصول على جميع الـ Tracks مع بيانات البرامج والأقسام
        $tracks = Track::with(['program', 'department', 'intakes'])->get();

        // إذا لم توجد تراكات في قاعدة البيانات، قم بإرجاع رسالة مفادها أن التراكات ستكون متاحة قريبًا
        if ($tracks->isEmpty()) {
            return response()->json(['message' => 'These tracks will be available soon'], 404);
        }

        return response()->json($tracks); // إرجاع التراكات
    }

    // البحث عن التراكات بناءً على المعايير المختلفة
    public function search(Request $request)
    {
        $query = Track::query();

        // البحث بالاسم
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // البحث بالـ program_id
        if ($request->has('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        // البحث بالـ department_id
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // البحث بالـ intake_id
        if ($request->has('intake_id')) {
            $query->whereHas('intakes', function ($q) use ($request) {
                $q->where('id', $request->intake_id);
            });
        }

        // جلب التراكات بناءً على المعايير
        $tracks = $query->get();

        // إذا لم توجد تراكات تطابق المعايير، إرجاع رسالة للمستخدم
        if ($tracks->isEmpty()) {
            return response()->json(['message' => 'These tracks will be available soon'], 404);
        }

        return response()->json($tracks); // إرجاع التراكات
    }

    public function count()
{
    $count = Track::count();
    return response()->json(['tracks_count' => $count]);
}

}
