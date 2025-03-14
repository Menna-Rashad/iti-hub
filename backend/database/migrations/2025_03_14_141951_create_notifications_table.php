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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id(); // معرف فريد للإشعار
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // معرف المستخدم (يرتبط بجدول users)
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null'); // معرف الشخص الذي أرسل الإشعار
            $table->unsignedBigInteger('related_id')->nullable(); // معرف العنصر المرتبط (مثل الوظيفة أو المشاركة في المنتدى)
            $table->enum('related_type', ['job', 'forum_post', 'mentorship', 'system']); // نوع العنصر المرتبط
            $table->text('message'); // نص الإشعار
            $table->enum('type', ['job_alert', 'forum_reply', 'mentorship_invite', 'system_update']); // نوع الإشعار
            $table->boolean('is_read')->default(false); // هل تم قراءة الإشعار أم لا
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
