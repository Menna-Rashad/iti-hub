<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    protected $fillable = [
        'group_title',
        'subgroup_title',
        'track_title',
        'slug',
        'description',
        'prerequisites',
        'delivery_approach',
        'eligible_applicants',
        'selection_process',
        'deliverables',
        'job_profiles',
        'certifications',
        'fundamental_courses',
        'core_courses',
        'soft_skills_courses',
        'targeted_outcomes',
        'program_hours',
        'pdf_path',
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'eligible_applicants' => 'array',
        'selection_process' => 'array',
        'job_profiles' => 'array',
        'certifications' => 'array',
        'fundamental_courses' => 'array',
        'core_courses' => 'array',
        'soft_skills_courses' => 'array',
        'targeted_outcomes' => 'array',
    ];
}
