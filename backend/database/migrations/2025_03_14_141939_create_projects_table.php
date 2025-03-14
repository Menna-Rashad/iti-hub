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
        Schema::create('projects', function (Blueprint $table) {
            $table->id(); // معرف فريد لكل مشروع
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // معرف المستخدم (يرتبط بجدول users)
            $table->string('title'); // عنوان المشروع
            $table->text('description'); // وصف المشروع
            $table->string('github_link'); // رابط GitHub للمشروع
            $table->text('contributors')->nullable(); // قائمة المساهمين (يمكن أن تحتوي على IDs للمساهمين الآخرين)
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
