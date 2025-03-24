<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInterestStatusToMentorshipSessions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // إضافة عمود interest_status إلى جدول mentorship_sessions
        Schema::table('mentorship_sessions', function (Blueprint $table) {
            $table->enum('interest_status', ['interested', 'attending', 'not_interested'])->nullable()->after('session_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // حذف عمود interest_status في حال التراجع عن الهجرة
        Schema::table('mentorship_sessions', function (Blueprint $table) {
            $table->dropColumn('interest_status');
        });
    }
}
