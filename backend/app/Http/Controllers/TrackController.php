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
        $tracks = Track::with(['program', 'department'])->get();

        // إعادة البيانات بتنسيق JSON
        return response()->json($tracks);
    }
}
