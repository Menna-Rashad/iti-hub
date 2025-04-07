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
        Schema::create('open_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');  
            $table->text('description'); 
            $table->string('technologies')->nullable(); 
            $table->string('github_url')->nullable(); 
            $table->enum('status', ['under_development', 'completed', 'in_review']); 
            $table->string('category'); 
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('open_projects');
    }
};
