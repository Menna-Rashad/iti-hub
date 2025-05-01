<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProgramAdminController extends Controller
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

        $programs = Program::with(['tracks', 'intakes'])->get();
        return response()->json($programs);
    }

    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:programs|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|string|max:50',
            'fees' => 'required|string|max:100',
            'eligibility' => 'required|array',
            'graduates_count' => 'required|integer|min:0',
            'job_profiles' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program = Program::create($request->only([
            'name', 'slug', 'description', 'duration', 'fees', 'eligibility',
            'graduates_count', 'job_profiles'
        ]));

        return response()->json($program, 201);
    }

    public function update(Request $request, Program $program)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:programs,slug,' . $program->id,
            'description' => 'nullable|string',
            'duration' => 'required|string|max:50',
            'fees' => 'required|string|max:100',
            'eligibility' => 'required|array',
            'graduates_count' => 'required|integer|min:0',
            'job_profiles' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program->update($request->only([
            'name', 'slug', 'description', 'duration', 'fees', 'eligibility',
            'graduates_count', 'job_profiles'
        ]));

        return response()->json($program);
    }

    public function destroy(Program $program)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $program->delete();
        return response()->json(null, 204);
    }
}