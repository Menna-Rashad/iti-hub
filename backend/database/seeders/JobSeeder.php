<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('job_listings')->insert([
            [
                'title'         => 'Junior Web Developer',
                'company_name'  => 'ABC Company',
                'location'     => 'Cairo, Egypt',
                'job_type'     => 'full-time',
                'job_state'     => 'on-site',
                'description'  => 'Responsible for building and maintaining websites.',
                'is_available'  => true,
                'requirements'  => '1+ years of experience in web development, proficiency in HTML, CSS, and JavaScript.',
                'salary_range'  => '$30,000 - $40,000',
                'apply_link'    => 'https://abccompany.com/careers/junior-web-developer',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'title'         => 'Frontend Engineer',
                'company_name'  => 'XYZ Corp',
                'location'     => 'Alexandria, Egypt',
                'job_type'     => 'full-time',
                'job_state'     => 'remote',
                'description'  => 'Focus on UI/UX and collaborate with design teams.',
                'is_available'  => true,
                'requirements'  => '2+ years of experience in frontend development, proficiency in React.js and CSS frameworks.',
                'salary_range'  => '$40,000 - $50,000',
                'apply_link'    => 'https://xyzcorp.com/careers/frontend-engineer',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'title'         => 'Backend Developer',
                'company_name'  => '123 Inc',
                'location'     => 'Giza, Egypt',
                'job_type'     => 'full-time',
                'job_state'     => 'hybrid',
                'description'  => 'Responsible for server-side web application logic.',
                'is_available'  => true,
                'requirements'  => '3+ years of experience in backend development, proficiency in PHP (Laravel) and MySQL.',
                'salary_range'  => '$50,000 - $60,000',
                'apply_link'    => 'https://123inc.com/careers/backend-developer',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'title'         => 'Full Stack Developer',
                'company_name'  => 'WebDev Ltd',
                'location'     => 'Luxor, Egypt',
                'job_type'     => 'full-time',
                'job_state'     => 'on-site',
                'description'  => 'Responsible for both front-end and back-end development.',
                'is_available'  => true,
                'requirements'  => '4+ years of experience in full-stack development, proficiency in JavaScript (Node.js, React) and databases.',
                'salary_range'  => '$60,000 - $70,000',
                'apply_link'    => 'https://webdevltd.com/careers/full-stack-developer',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}