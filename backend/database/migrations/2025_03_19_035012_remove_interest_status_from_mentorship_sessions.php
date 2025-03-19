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
    Schema::table('mentorship_sessions', function (Blueprint $table) {
        $table->dropColumn('interest_status');
    });
}

public function down()
{
    Schema::table('mentorship_sessions', function (Blueprint $table) {
        $table->enum('interest_status', ['interested', 'attending', 'not_interested'])->nullable()->after('session_date');
    });
}

};
