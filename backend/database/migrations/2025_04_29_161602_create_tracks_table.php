<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->string('group_title');
            $table->string('subgroup_title')->nullable();
            $table->string('track_title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->json('prerequisites')->nullable();
            $table->string('delivery_approach')->nullable();
            $table->json('eligible_applicants')->nullable();
            $table->json('selection_process')->nullable();
            $table->text('deliverables')->nullable();
            $table->json('job_profiles')->nullable();
            $table->json('certifications')->nullable();
            $table->json('fundamental_courses')->nullable();
            $table->json('core_courses')->nullable();
            $table->json('soft_skills_courses')->nullable();
            $table->json('targeted_outcomes')->nullable();
            $table->integer('program_hours')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
