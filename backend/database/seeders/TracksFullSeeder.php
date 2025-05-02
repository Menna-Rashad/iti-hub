<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Program;
use App\Models\Track;
use App\Models\Intake;

class TracksFullSeeder extends Seeder
{
    public function run(): void
    {
        // Create departments
        $departments = [
            'Web Development' => 'web-dev',
            'Artificial Intelligence' => 'ai',
            'Cyber Security' => 'cyber-security',
        ];

        foreach ($departments as $name => $slug) {
            Department::firstOrCreate(['slug' => $slug], ['name' => $name]);
        }

        // Create programs
        $programs = [];
        foreach ($departments as $deptName => $deptSlug) {
            $department = Department::where('slug', $deptSlug)->first();

            for ($i = 1; $i <= 2; $i++) {
                $program = Program::firstOrCreate(
                    ['slug' => $deptSlug . '-program-' . $i],
                    [
                        'name' => "$deptName Program $i",
                        'description' => "Description for $deptName Program $i",
                        'duration' => $i % 2 == 0 ? '4 Months' : '9 Months',
                        'fees' => 'Free',
                        'eligibility' => json_encode(['CS Graduates', 'Engineering']),
                        'graduates_count' => 100 + $i * 50,
                        'job_profiles' => 'Developer, Analyst',
                        'department_id' => $department->id,
                    ]
                );

                $programs[] = $program;
            }
        }

        // Track names
        $trackNames = [
            'Frontend Development', 'Backend Development', 'Fullstack',
            'NLP', 'Deep Learning', 'DevOps', 'Network Security',
            'Data Analysis', 'AI Basics', 'System Design'
        ];

        // Create tracks
        $tracks = [];
        foreach ($trackNames as $index => $trackName) {
            $program = $programs[$index % count($programs)];
            $track = Track::create([
                'name' => $trackName,
                'slug' => strtolower(str_replace(' ', '-', $trackName)),
                'description' => "This is the $trackName track.",
                'program_id' => $program->id,
                'department_id' => $program->department_id,
            ]);
            $tracks[] = $track;
        }

        // Create intakes
        $intake1 = Intake::create([
            'program_id' => $programs[0]->id,
            'intake_cycle' => 'Spring 2025',
            'status' => 'Planned',
            'admission_start' => now()->subDays(30),
            'admission_end' => now()->addDays(10),
            'training_start' => now()->addDays(20),
            'training_end' => now()->addMonths(4),
        ]);

        $intake2 = Intake::create([
            'program_id' => $programs[1]->id,
            'intake_cycle' => 'Fall 2025',
            'status' => 'Admission Started',
            'admission_start' => now()->subDays(15),
            'admission_end' => now()->addDays(20),
            'training_start' => now()->addDays(30),
            'training_end' => now()->addMonths(5),
        ]);

        // Attach tracks to intakes
        $intake1->tracks()->attach(array_slice(array_column($tracks, 'id'), 0, 5));
        $intake2->tracks()->attach(array_slice(array_column($tracks, 'id'), 5, 5));
    }
}
