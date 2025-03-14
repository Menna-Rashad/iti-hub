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
        // إضافة الأعمدة الجديدة إلى جدول users
        Schema::table('users', function (Blueprint $table) {
            // إضافة عمود role
            $table->enum('role', ['student', 'graduate', 'mentor', 'admin'])->after('email'); // إضافة عمود role
            // إضافة عمود profile_picture
            $table->string('profile_picture')->nullable()->after('role'); // إضافة عمود profile_picture
            // إضافة عمود bio
            $table->text('bio')->nullable()->after('profile_picture'); // إضافة عمود bio
            // إضافة عمود linkedin
            $table->string('linkedin')->nullable()->after('bio'); // إضافة عمود linkedin
            // إضافة عمود github
            $table->string('github')->nullable()->after('linkedin'); // إضافة عمود github
            // إضافة عمود is_verified
            $table->boolean('is_verified')->default(false)->after('github'); // إضافة عمود is_verified
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // إزالة الأعمدة في حالة التراجع عن الهجرة
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'profile_picture', 'bio', 'linkedin', 'github', 'is_verified']);
        });
    }
};
