<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;

class JobListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(JobListing::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'company_name' => 'required|string',
            'location' => 'required|string',
            'job_type' => 'required|in:full-time,part-time,internship',
            'job_state' => 'required|in:hybrid,on-site,remote',
            'description' => 'required|string',
            'is_available' => 'boolean',
            'requirements' => 'required|string',
            'salary_range' => 'nullable|string',
            'apply_link' => 'required|url'
        ]);

        $job = JobListing::create($data);

        return response()->json($job, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $job = JobListing::findOrFail($id);
        return response()->json($job);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $job = JobListing::findOrFail($id);

        $data = $request->validate([
            'title' => 'string',
            'company_name' => 'string',
            'location' => 'string',
            'job_type' => 'in:full-time,part-time,internship',
            'job_state' => 'in:hybrid,on-site,remote',
            'description' => 'string',
            'is_available' => 'boolean',
            'requirements' => 'string',
            'salary_range' => 'nullable|string',
            'apply_link' => 'url'
        ]);

        $job->update($data);

        return response()->json($job);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $job = JobListing::findOrFail($id);
        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }
}
