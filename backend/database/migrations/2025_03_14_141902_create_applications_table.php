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
        Schema::create('applications', function (Blueprint $table) {
            $table->id(); // معرف فريد لكل تقديم
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // معرف المستخدم الذي قام بالتقديم
            $table->foreignId('job_listings_id')->constrained()->onDelete('cascade'); // معرف الوظيفة المتقدم إليها
            $table->enum('status', ['pending', 'accepted', 'rejected', 'withdrawn'])->default('pending'); // حالة التقديم
            $table->string('resume_file_path')->nullable(); // مسار السيرة الذاتية (اختياري)
            $table->timestamps(); // تواريخ الإنشاء والتحديث
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
