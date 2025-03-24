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
    Schema::create('mentorship_user', function (Blueprint $table) {
        $table->id();  // معرف فريد
        $table->foreignId('mentorship_session_id')->constrained('mentorship_sessions')->onDelete('cascade'); // معرف الجلسة
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');  // معرف المستخدم (المتدرب)
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('mentorship_user');
}

};
