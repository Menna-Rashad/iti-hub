<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'badge_type',
        'earned_at',
    ];

    // علاقة الـ Badge مع الـ User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
