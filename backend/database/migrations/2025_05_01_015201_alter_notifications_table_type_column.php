<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterNotificationsTableTypeColumn extends Migration
{
    public function up()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // تغيير العمود type ليكون enum مع القيم المسموحة
            $table->enum('type', ['ticket_reply', 'system_update', 'news_update'])
                  ->nullable()
                  ->change();
        });
    }

    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // رجع العمود للحالة القديمة (حسب التعريف القديم)
            $table->string('type', 10)->nullable()->change();
        });
    }
}