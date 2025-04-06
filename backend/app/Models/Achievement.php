<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'status', // 'completed' أو 'in_progress' أو أي حالة أخرى
        'date_completed',
    ];

    // علاقة الـ Achievement مع الـ User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
