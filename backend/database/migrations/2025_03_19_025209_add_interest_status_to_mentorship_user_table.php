<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInterestStatusToMentorshipUserTable extends Migration
{
    public function up()
    {
        Schema::table('mentorship_user', function (Blueprint $table) {
            $table->enum('interest_status', ['interested', 'attending', 'not_interested'])->nullable()->after('mentorship_session_id');
        });
    }

    public function down()
    {
        Schema::table('mentorship_user', function (Blueprint $table) {
            $table->dropColumn('interest_status');
        });
    }
}
