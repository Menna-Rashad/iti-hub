<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Intake;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class IntakeAdminController extends Controller
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

        $intakes = Intake::with('program')->get();
        return response()->json($intakes);
    }

    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'intake_cycle' => 'required|string|max:100',
            'status' => 'required|string|in:Planned,Admission Started,Ongoing,Training Ended',
            'admission_start' => 'nullable|date',
            'admission_end' => 'nullable|date|after_or_equal:admission_start',
            'training_start' => 'nullable|date',
            'training_end' => 'nullable|date|after_or_equal:training_start',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $intake = Intake::create($request->only([
            'program_id', 'intake_cycle', 'status', 'admission_start',
            'admission_end', 'training_start', 'training_end'
        ]));

        return response()->json($intake, 201);
    }

    public function update(Request $request, Intake $intake)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'intake_cycle' => 'required|string|max:100',
            'status' => 'required|string|in:Planned,Admission Started,Ongoing,Training Ended',
            'admission_start' => 'nullable|date',
            'admission_end' => 'nullable|date|after_or_equal:admission_start',
            'training_start' => 'nullable|date',
            'training_end' => 'nullable|date|after_or_equal:training_start',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $intake->update($request->only([
            'program_id', 'intake_cycle', 'status', 'admission_start',
            'admission_end', 'training_start', 'training_end'
        ]));

        return response()->json($intake);
    }

    public function destroy(Intake $intake)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $intake->delete();
        return response()->json(null, 204);
    }
}