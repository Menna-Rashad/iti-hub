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
        Schema::table('badges', function (Blueprint $table) {
            // تعديل عمود 'badge_name' ليأخذ قيمة افتراضية
            $table->string('badge_name')->default('New Badge')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('badges', function (Blueprint $table) {
            // إزالة القيمة الافتراضية عن عمود 'badge_name'
            $table->string('badge_name')->default(null)->change();
        });
    }
};
