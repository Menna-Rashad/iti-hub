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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // لتخزين معرف المستخدم الذي قام بالتعليق
            $table->foreignId('post_id')->constrained('forum_posts')->onDelete('cascade'); // لتخزين معرف الموضوع الذي تم التعليق عليه
            $table->foreignId('parent_comment_id')->nullable()->constrained('comments')->onDelete('cascade'); // لتعليقات الردود (اختياري)
            $table->text('content'); // محتوى التعليق
            $table->integer('upvotes')->default(0); // عدد الإعجابات
            $table->integer('downvotes')->default(0); // عدد عدم الإعجابات
            $table->boolean('is_flagged')->default(false); // إذا كان التعليق مرفوضًا
            $table->timestamps(); // لتخزين تاريخ الإنشاء والتحديث
                // إضافة الفهرس
            $table->index('post_id');
            $table->index('parent_comment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
