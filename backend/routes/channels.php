<?php

use Illuminate\Support\Facades\Broadcast;
// قنوات البث الخاصة بالمستخدمين
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// قناة أخبار admin التي يتابعها جميع المستخدمين
Broadcast::channel('admin-news', function ($user) {
    return $user->role === 'admin'; // تأكد أن المستخدم من نوع admin
});
