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
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('role');
            $table->text('bio')->nullable()->after('profile_picture');
            $table->string('linkedin')->nullable()->after('bio');
            $table->string('github')->nullable()->after('linkedin');
            $table->boolean('is_verified')->default(false)->after('github');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'profile_picture',
                'bio',
                'linkedin',
                'github',
                'is_verified'
            ]);
        });
    }
};
