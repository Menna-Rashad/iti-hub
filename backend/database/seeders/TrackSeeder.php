<?php

namespace Database\Seeders;

use App\Models\Track;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

public function run()
{
    Track::create([
        'group_title' => '9 Months',
        'subgroup_title' => 'Infrastructure & Security',
        'track_title' => 'Cyber Security',
        'slug' => 'cyber-security',
        'description' => 'Learn to protect networks, systems, and data from cyber threats.',
        'prerequisites' => [
            'Introduction to Computer Networks',
            'Introduction to Cybersecurity',
            'VMware Foundation'
        ],
        'delivery_approach' => '75% face to face, 25% online',
        'eligible_applicants' => [
            'Computer Engineering',
            'Communications Engineering',
            'Computer Science'
        ],
        'selection_process' => [
            'IQ and Problem-Solving Exam',
            'Technical Exam',
            'Technical Interview',
            'Interpersonal Skills Interview'
        ],
        'deliverables' => 'International certificate',
        'job_profiles' => [
            'Penetration Tester',
            'Cyber Incident Responder'
        ],
        'certifications' => [
            'eLearnSecurity eWPT',
            'eLearnSecurity eMAPT',
            'ECIR'
        ],
        'fundamental_courses' => [
            'Operating Systems Fundamentals',
            'Database Fundamentals',
            'Client-Side Technologies',
            'Introduction to Programming'
        ],
        'core_courses' => [
            'Incident Handling',
            'Malware Analysis',
            'Web Penetration Testing'
        ],
        'soft_skills_courses' => [
            'Communication Essentials',
            'High Impact Presentations',
            'Job Seeking Skills'
        ],
        'targeted_outcomes' => [
            'Vodafone',
            'WE',
            'Fawry'
        ],
        'program_hours' => 1503,
        'pdf_path' => 'tracks-pdfs/cybersecurity.pdf'
    ]);
}

}
