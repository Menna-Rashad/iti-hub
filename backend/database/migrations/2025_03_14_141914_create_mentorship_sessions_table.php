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
        Schema::create('mentorship_sessions', function (Blueprint $table) {
            $table->id(); // معرف فريد لكل جلسة توجيه
            $table->foreignId('mentor_id')->constrained('users')->onDelete('cascade'); // معرف المرشد (يرتبط بجدول users)
            $table->foreignId('mentee_id')->nullable()->constrained('users')->onDelete('cascade'); // معرف المتدرب (يرتبط بجدول users) مع nullable
            $table->dateTime('session_date'); // تاريخ الجلسة
            $table->enum('session_status', ['scheduled', 'completed', 'cancelled'])->default('scheduled'); // حالة الجلسة
            $table->enum('platform', ['Zoom', 'Google Meet', 'Teams'])->nullable(); // منصة الجلسة
            $table->integer('mentor_rating')->nullable(); // تقييم المرشد (اختياري)
            $table->text('mentee_feedback')->nullable(); // ملاحظات المتدرب (اختياري)
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentorship_sessions');
    }
};
