<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'sender_id', // مرسِل الإشعار
        'message',
        'type',
        'is_read',
        'read_at',
        'related_type', // نوع الكائن المرتبط بالإشعار
        'related_id',   // ID الكائن المرتبط
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_read' => 'boolean',  // تحويل إلى نوع منطقي
        'read_at' => 'datetime', // تحويل إلى تاريخ ووقت
    ];

    /**
     * Get the user that this notification belongs to.
     */
    public function user()
    {
        return $this->belongsTo(User::class,'user_id'); // العلاقة مع المستخدم الذي سيحصل على الإشعار
    }

    /**
     * Get the notifiable entity that this notification belongs to.
     */
    public function related()
    {
        return $this->morphTo();  // العلاقة المتعددة المورف (الـ related_type و الـ related_id سيساعدونك هنا)
    }
}
