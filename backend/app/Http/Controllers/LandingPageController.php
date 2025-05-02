<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\User; // إضافة هذه السطر لاستيراد نموذج User
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    public function news()
    {
        return response()->json(News::latest()->get());
    }

    public function getTotalUsers()
    {
        // عداد المستخدمين الكلي
        $totalUsers = User::count();

        return response()->json([
            'total_users' => $totalUsers,
        ]);
    }

    public function getRecentUsersThisMonth()
    {
        // عداد المستخدمين الجدد في الشهر الحالي
        $currentMonthStart = now()->startOfMonth();
        $recentUsersThisMonth = User::where('created_at', '>=', $currentMonthStart)->count();

        return response()->json([
            'recent_users_this_month' => $recentUsersThisMonth,
        ]);
    }
}
