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
            // إضافة قيمة افتراضية لعمود 'badge_icon_path'
            $table->string('badge_icon_path')->default('default_icon_path.svg')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('badges', function (Blueprint $table) {
            // إزالة القيمة الافتراضية عن عمود 'badge_icon_path'
            $table->string('badge_icon_path')->default(null)->change();
        });
    }
};
