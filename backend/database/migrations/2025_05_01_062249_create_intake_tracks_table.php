<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIntakeTracksTable extends Migration
{
    public function up()
    {
        Schema::create('intake_tracks', function (Blueprint $table) {
            $table->foreignId('intake_id')->constrained()->onDelete('cascade');
            $table->foreignId('track_id')->constrained()->onDelete('cascade');
            $table->primary(['intake_id', 'track_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('intake_tracks');
    }
}