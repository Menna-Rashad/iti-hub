<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumPost;
use App\Models\User;
use App\Models\Category;
use Faker\Factory as Faker;

class ForumPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('en_US');
        
        // Get all users and categories
        $users = User::all();
        $categories = Category::all();

        // Define exactly 10 unique English posts
        $posts = [
            [
                'title' => 'Understanding Angular Components',
                'content' => 'Angular components are the fundamental building blocks of Angular applications. Learn how to create, use, and manage components effectively.',
                'category_id' => 2, // Angular
                'tags' => 'angular,components,frontend'
            ],
            [
                'title' => 'Best Practices for Laravel Development',
                'content' => 'Discover the best practices for Laravel development, including proper routing, middleware usage, and database optimization techniques.',
                'category_id' => 4, // Laravel
                'tags' => 'laravel,php,backend'
            ],
            [
                'title' => 'Interview Preparation Tips',
                'content' => 'Learn how to prepare for technical interviews, including common questions, coding challenges, and behavioral interview techniques.',
                'category_id' => 1, // General
                'tags' => 'interview,career,preparation'
            ],
            [
                'title' => 'Building a Strong Tech Portfolio',
                'content' => 'A comprehensive guide on creating an impressive tech portfolio that showcases your skills and attracts potential employers.',
                'category_id' => 1, // General
                'tags' => 'portfolio,career,development'
            ],
            [
                'title' => 'Welcome to ITI Hub!',
                'content' => 'Welcome to our community! Learn about the platform, its features, and how to get the most out of your ITI Hub experience.',
                'category_id' => 1, // General
                'tags' => 'welcome,community,guide'
            ],
            [
                'title' => 'Getting Started with TypeScript',
                'content' => 'A beginner-friendly guide to TypeScript, covering basic concepts, type definitions, and integration with Angular.',
                'category_id' => 2, // Angular
                'tags' => 'typescript,programming,frontend'
            ],
            [
                'title' => 'Remote Work Best Practices',
                'content' => 'Essential tips and strategies for effective remote work, including time management, communication, and productivity tools.',
                'category_id' => 1, // General
                'tags' => 'remote,work,productivity'
            ],
            [
                'title' => 'Community Guidelines',
                'content' => 'Our community guidelines ensure a positive and productive environment for all members. Please review and follow these rules.',
                'category_id' => 1, // General
                'tags' => 'guidelines,community,rules'
            ],
            [
                'title' => 'Docker for Beginners',
                'content' => 'Learn the basics of Docker, containerization, and how to use Docker in your development workflow.',
                'category_id' => 4, // Laravel
                'tags' => 'docker,devops,containers'
            ],
            [
                'title' => 'Success Stories',
                'content' => 'Read inspiring success stories from our community members who have achieved their career goals through ITI Hub.',
                'category_id' => 1, // General
                'tags' => 'success,stories,inspiration'
            ]
        ];

        // Create exactly 10 posts
        foreach ($posts as $postData) {
            ForumPost::create([
                'user_id' => $users->random()->id,
                'category_id' => $postData['category_id'],
                'title' => $postData['title'],
                'content' => $postData['content'],
                'tags' => $postData['tags'],
                'upvotes' => $faker->numberBetween(0, 100),
                'downvotes' => $faker->numberBetween(0, 20),
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => $faker->dateTimeBetween('-1 year', 'now'),
            ]);
        }
    }
} 