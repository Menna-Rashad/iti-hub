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
    Schema::create('mentorship_materials', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('mentorship_session_id');
        $table->string('file_path');
        $table->string('file_name');
        $table->timestamps();

        $table->foreign('mentorship_session_id')->references('id')->on('mentorship_sessions')->onDelete('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('mentorship_materials');
}

};
