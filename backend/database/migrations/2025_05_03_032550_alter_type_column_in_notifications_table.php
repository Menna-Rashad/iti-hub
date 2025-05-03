<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // لو العمود نوعه string
            $table->string('type', 50)->change();

            // أو لو نوعه ENUM وعاوز تضيف قيم جديدة:
            // Laravel ما بيدعم تعديل ENUM بسهولة، فلو محتاج ده عرف العمود string بدل enum.
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('type', 20)->change(); // أو النوع السابق اللي كان موجود
        });
    }
};
