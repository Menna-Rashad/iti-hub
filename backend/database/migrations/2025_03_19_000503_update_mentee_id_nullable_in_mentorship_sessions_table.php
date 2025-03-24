<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateMenteeIdNullableInMentorshipSessionsTable extends Migration
{
    public function up()
    {
        // التحقق إذا كان العمود `mentee_id` موجودًا بالفعل
        if (!Schema::hasColumn('mentorship_sessions', 'mentee_id')) {
            Schema::table('mentorship_sessions', function (Blueprint $table) {
                // إضافة العمود `mentee_id` إذا لم يكن موجودًا
                $table->foreignId('mentee_id')->nullable()->constrained('users')->onDelete('cascade');
            });
        }
    }

    public function down()
    {
        // حذف قيد المفتاح الأجنبي قبل حذف العمود
        Schema::table('mentorship_sessions', function (Blueprint $table) {
            $table->dropForeign(['mentee_id']); // حذف قيد المفتاح الأجنبي
            $table->dropColumn('mentee_id'); // حذف العمود بعد ذلك
        });
    }
}
