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
        Schema::create('messages', function (Blueprint $table) {
            $table->id(); // معرف الرسالة
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // معرف المرسل (يرتبط بجدول users)
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade'); // معرف المستقبل (يرتبط بجدول users)
            $table->text('content'); // محتوى الرسالة
            $table->string('attachment_path')->nullable(); // مسار المرفقات (اختياري)
            $table->boolean('is_read')->default(false); // هل تم قراءة الرسالة أم لا
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
