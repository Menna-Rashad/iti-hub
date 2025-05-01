<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TrackAdminController extends Controller
{
    public function __construct()
    {
        // Removed: $this->middleware('auth:sanctum');
        // The middleware is already applied in routes/api.php
    }

    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tracks = Track::with(['program', 'department', 'intakes'])->get();
        return response()->json($tracks);
    }

    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:tracks|max:255',
            'program_id' => 'required|exists:programs,id',
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $track = Track::create($request->only([
            'name', 'slug', 'program_id', 'department_id', 'description'
        ]));

        return response()->json($track, 201);
    }

    public function update(Request $request, Track $track)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:tracks,slug,' . $track->id,
            'program_id' => 'required|exists:programs,id',
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $track->update($request->only([
            'name', 'slug', 'program_id', 'department_id', 'description'
        ]));

        return response()->json($track);
    }

    public function destroy(Track $track)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $track->delete();
        return response()->json(null, 204);
    }
}