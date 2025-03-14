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
        Schema::create('badges', function (Blueprint $table) {
            $table->id(); // معرف فريد لكل جائزة
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // معرف المستخدم (يرتبط بجدول users)
            $table->string('badge_name'); // اسم الجائزة
            $table->enum('badge_type', ['gold', 'silver', 'bronze']); // نوع الجائزة (ذهبية، فضية، أو برونزية)
            $table->string('badge_icon_path'); // مسار الأيقونة الخاصة بالجائزة
            $table->timestamp('earned_at')->useCurrent(); // وقت اكتساب الجائزة
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
