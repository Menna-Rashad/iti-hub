<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // لتخزين معرف المستخدم الذي نشر الموضوع
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null'); // لتخزين فئة الموضوع
            $table->string('title')->nullable(); // عنوان الموضوع
            $table->text('content'); // محتوى الموضوع
            $table->string('tags')->nullable(); // علامات الموضوع
            $table->integer('upvotes')->default(0); // عدد الإعجابات
            $table->integer('downvotes')->default(0); // عدد عدم الإعجابات
            $table->timestamps(); // لتخزين تاريخ الإنشاء والتحديث
            $table->fullText(['title', 'content', 'tags']);
               // إضافة الفهرس
            // $table->fullText(['title', 'content']);
            $table->index(['category_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
    }
};
