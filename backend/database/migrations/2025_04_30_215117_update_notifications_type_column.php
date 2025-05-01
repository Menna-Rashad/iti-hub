<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // تعديل حقل type لإضافة القيم الجديدة
            $table->enum('type', [
                'job_alert',
                'forum_reply',
                'mentorship_invite',
                'system_update',
                'post_created', // القيمة الجديدة
                'ticket_reply', // القيمة الجديدة
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // إرجاع القيم القديمة لو عملنا rollback
            $table->enum('type', [
                'job_alert',
                'forum_reply',
                'mentorship_invite',
                'system_update',
            ])->change();
        });
    }
};