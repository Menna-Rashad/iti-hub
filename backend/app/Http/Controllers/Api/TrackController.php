<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function index()
    {
        return response()->json(Track::all());
    }

    public function show($slug)
    {
        $track = Track::where('slug', $slug)->first();

        if (!$track) {
            return response()->json(['message' => 'Track not found'], 404);
        }

        return response()->json($track);
    }
}
