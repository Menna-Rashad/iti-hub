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
    // التأكد من وجود الجدول، إذا كان موجودًا نحدثه بدلاً من إنشاءه من جديد
    if (!Schema::hasTable('notifications')) {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // المستخدم الذي سيحصل على الإشعار
            $table->unsignedBigInteger('sender_id'); // مرسل الإشعار (عادةً الأدمن)
            $table->string('related_type'); // نوع الكائن (مثل: post, ticket)
            $table->text('message'); // نص الإشعار
            $table->enum('type', ['post_created', 'ticket_reply', 'post_comment'])->default('post_created'); // فقط الحالتين دول
            $table->boolean('is_read')->default(false); // إذا كان الإشعار تم قراءته
            $table->timestamp('read_at')->nullable(); // وقت قراءة الإشعار
            $table->timestamps();
            
            // العلاقات
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
