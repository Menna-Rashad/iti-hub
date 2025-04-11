<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpenProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'technologies',
        'github_url',
        'status',
        'category',
        'user_id', 
    ];
}
