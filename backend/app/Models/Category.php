<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name','post_count'];

    public function forumPosts(): HasMany
    {
        return $this->hasMany(ForumPost::class);
    }
     // You can specify the table name if it's different from the default 'categories'
     protected $table = 'categories'; 

    
}