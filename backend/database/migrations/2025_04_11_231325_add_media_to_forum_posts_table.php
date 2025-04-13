<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->json('media')->nullable()->after('tags'); // حقل JSON لتخزين روابط الوسائط
        });
    }

    public function down(): void {
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->dropColumn('media');
        });
    }
};
