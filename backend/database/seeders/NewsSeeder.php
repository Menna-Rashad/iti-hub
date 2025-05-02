<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $news = [
            [
                'title' => 'ITI Launches New Cyber Security Track',
                'content' => 'The Information Technology Institute has officially launched a new Cyber Security track starting Fall 2025.'
            ],
            [
                'title' => 'Admission Now Open for Spring 2025',
                'content' => 'Admissions are now open for the Spring 2025 cycle. Apply now before the deadline closes!'
            ],
            [
                'title' => 'New Collaboration with Google Developers Group',
                'content' => 'ITI is partnering with GDG Cairo to bring mentorship and job opportunities to graduates.'
            ],
            [
                'title' => 'Graduation Ceremony Held in Smart Village',
                'content' => 'More than 500 graduates attended ITI’s graduation ceremony held last Thursday in Smart Village.'
            ],
            [
                'title' => 'Data Science Track Ranked Top Among Students',
                'content' => 'The Data Science track received the highest satisfaction rating among trainees this year.'
            ],
        ];

        foreach ($news as $item) {
            News::create($item);
        }
    }
}
