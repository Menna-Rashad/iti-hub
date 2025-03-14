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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id(); // معرف المحادثة
            $table->foreignId('user_one')->constrained('users')->onDelete('cascade'); // معرف المستخدم الأول (يرتبط بجدول users)
            $table->foreignId('user_two')->constrained('users')->onDelete('cascade'); // معرف المستخدم الثاني (يرتبط بجدول users)
            $table->foreignId('last_message_id')->nullable()->constrained('messages')->onDelete('set null'); // آخر رسالة في المحادثة (اختياري)
            $table->boolean('is_typing')->default(false); // حالة الكتابة (هل أحد المستخدمين يكتب الآن؟)
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
