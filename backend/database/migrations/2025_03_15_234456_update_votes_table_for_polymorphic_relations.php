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
        Schema::table('votes', function (Blueprint $table) {
            $table->dropForeign(['forum_post_id']);
            $table->dropForeign(['comment_id']);
            $table->dropColumn(['forum_post_id', 'comment_id']);
            $table->unsignedBigInteger('votable_id');
            $table->string('votable_type');
        });
    }
    
    public function down() {
        Schema::table('votes', function (Blueprint $table) {
            $table->foreignId('forum_post_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('comment_id')->nullable()->constrained()->onDelete('cascade');
            $table->dropMorphs('votable');
        });
    }
};
