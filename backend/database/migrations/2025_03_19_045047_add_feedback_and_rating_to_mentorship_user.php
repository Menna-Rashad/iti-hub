<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('mentorship_user', function (Blueprint $table) {
        $table->text('feedback')->nullable(); // تعليق المستخدم
        $table->integer('rating')->nullable(); // تقييم الجلسة (من 1 إلى 5)
    });
}

public function down()
{
    Schema::table('mentorship_user', function (Blueprint $table) {
        $table->dropColumn(['feedback', 'rating']);
    });
}

};
