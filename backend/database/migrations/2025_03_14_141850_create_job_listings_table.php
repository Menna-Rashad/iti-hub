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
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // عنوان الوظيفة
            $table->string('company_name'); // اسم الشركة
            $table->string('location'); // موقع الوظيفة
            $table->enum('job_type', ['full-time', 'part-time', 'internship']); // نوع الوظيفة
            $table->enum('job_state', ['hybrid', 'on-site', 'remote']); // حالة الوظيفة (عن بُعد، موقع العمل، هجينة)
            $table->text('description'); // وصف الوظيفة
            $table->boolean('is_available')->default(true); // حالة الوظيفة (متاحة أو غير متاحة)
            $table->text('requirements'); // متطلبات الوظيفة
            $table->string('salary_range', 100)->nullable(); // نطاق الراتب
            $table->string('apply_link'); // رابط التقديم للوظيفة
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
