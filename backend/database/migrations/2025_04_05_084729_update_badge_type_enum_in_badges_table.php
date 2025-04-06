<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('badges', function (Blueprint $table) {
            // تغيير نوع العمود badge_type إلى enum جديد
            $table->enum('badge_type', ['gold', 'silver', 'bronze'])->default('bronze')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('badges', function (Blueprint $table) {
            // التراجع عن التغيير إلى نوع البيانات السابق
            $table->string('badge_type')->change();
        });
    }
};
