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
    Schema::table('notifications', function (Blueprint $table) {
        $table->string('related_type', 50)->nullable()->change();
    });
}

public function down()
{
    Schema::table('notifications', function (Blueprint $table) {
        $table->string('related_type', 10)->nullable()->change();
    });
}
};
