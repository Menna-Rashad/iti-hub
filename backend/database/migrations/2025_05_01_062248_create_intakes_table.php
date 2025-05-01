<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIntakesTable extends Migration
{
    public function up()
    {
        Schema::create('intakes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->string('intake_cycle');
            $table->string('status');
            $table->date('admission_start')->nullable();
            $table->date('admission_end')->nullable();
            $table->date('training_start')->nullable();
            $table->date('training_end')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('intakes');
    }
}