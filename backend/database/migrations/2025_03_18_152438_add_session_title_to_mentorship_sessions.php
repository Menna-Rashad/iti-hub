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
        Schema::table('mentorship_sessions', function (Blueprint $table) {
            //
            $table->string('session_title');  // عنوان الجلسة
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mentorship_sessions', function (Blueprint $table) {
            //
            $table->dropColumn('session_title');
        });
    }
};
