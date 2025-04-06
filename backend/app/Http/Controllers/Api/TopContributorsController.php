<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\ForumPost;
use App\Models\Points;
use App\Models\Achievement;
use App\Models\MentorshipSession;
use App\Models\MentorshipUser;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;

class TopContributorsController extends Controller
{
    // بادج المستخدم الجديد
    public function assignInitialBadge($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $existingBadge = Badge::where('user_id', $userId)
                                  ->where('badge_type', 'bronze')
                                  ->first();

            if (!$existingBadge) {
                Badge::create([
                    'user_id' => $userId,
                    'badge_type' => 'bronze',
                    'badge_name' => 'New User',
                    'earned_at' => now(),
                ]);
            }

            return response()->json(['message' => 'Initial badge assigned successfully']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // بادج بناء على عدد البوستات
    public function assignPostBadge($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $userPostsCount = ForumPost::where('user_id', $userId)->count();

            if ($userPostsCount >= 100) {
                $this->assignBadgeIfNotExists($userId, 'gold');
            } elseif ($userPostsCount >= 50) {
                $this->assignBadgeIfNotExists($userId, 'silver');
            } elseif ($userPostsCount >= 10) {
                $this->assignBadgeIfNotExists($userId, 'bronze');
            }

            return response()->json(['message' => 'Post badge assigned successfully']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // بادج التفاعل (تصويتات)
    public function assignEngagementBadge($userId)
    {
        try {
            $userVotesCount = Vote::where('user_id', $userId)
                                  ->whereIn('vote_type', ['upvote', 'downvote'])
                                  ->count();

            if ($userVotesCount >= 200) {
                $this->assignBadgeIfNotExists($userId, 'gold');
            } elseif ($userVotesCount >= 100) {
                $this->assignBadgeIfNotExists($userId, 'silver');
            } elseif ($userVotesCount >= 50) {
                $this->assignBadgeIfNotExists($userId, 'bronze');
            }

            return response()->json(['message' => 'Engagement badge assigned successfully']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // بادج النشاط بناءً على مدة التسجيل
    public function assignActivityBadge($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $activityDuration = now()->diffInDays($user->created_at);

            if ($activityDuration >= 365) {
                $this->assignBadgeIfNotExists($userId, 'gold');
            } elseif ($activityDuration >= 180) {
                $this->assignBadgeIfNotExists($userId, 'silver');
            } elseif ($activityDuration >= 30) {
                $this->assignBadgeIfNotExists($userId, 'bronze');
            }

            return response()->json(['message' => 'Activity badge assigned successfully']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // بادج الإنجازات
    public function assignAchievementBadge($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $achievementsCompleted = Achievement::where('user_id', $userId)
                                                ->where('status', 'completed')
                                                ->count();

            if ($achievementsCompleted >= 5) {
                $this->assignBadgeIfNotExists($userId, 'gold');
            } elseif ($achievementsCompleted >= 3) {
                $this->assignBadgeIfNotExists($userId, 'silver');
            } elseif ($achievementsCompleted >= 1) {
                $this->assignBadgeIfNotExists($userId, 'bronze');
            }

            return response()->json(['message' => 'Achievement badge assigned successfully']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // حساب النقاط فقط بدون بادج mentor
    public function assignMentorshipPoints($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $sessionsBooked = MentorshipSession::where('mentor_id', $userId)
                                               ->orWhere('mentee_id', $userId)
                                               ->count();

            $interestStatus = MentorshipUser::where('user_id', $userId)
                                            ->where('interest_status', 'interested')
                                            ->count();

            $points = $sessionsBooked * 10 + ($interestStatus * 5);

            Points::updateOrCreate(
                ['user_id' => $userId],
                ['points' => $points]
            );

            return response()->json([
                'message' => 'Points calculated successfully',
                'sessions_booked' => $sessionsBooked,
                'interests' => $interestStatus,
                'total_points' => $points
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // إظهار البادجات الخاصة بمستخدم
    public function getUserBadges($userId)
    {
        try {
            $badges = Badge::where('user_id', $userId)->get();

            if ($badges->isEmpty()) {
                return response()->json(['message' => 'No badges found for this user.']);
            }

            return response()->json([
                'user_id' => $userId,
                'badges' => $badges
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // إظهار السكور الخاص بالمستخدم
    public function getUserScore($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $points = Points::where('user_id', $userId)->first();

            return response()->json([
                'user_id' => $userId,
                'total_points' => $points ? $points->points : 0
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // دالة داخلية لتخصيص البادج إذا لم يكن موجود مسبقًا
    private function assignBadgeIfNotExists($userId, $badgeType)
    {
        $existingBadge = Badge::where('user_id', $userId)
                              ->where('badge_type', $badgeType)
                              ->first();

        if (!$existingBadge) {
            Badge::create([
                'user_id' => $userId,
                'badge_type' => $badgeType,
                'earned_at' => now(),
            ]);
        }
    }

    // دالة موحدة لمعالجة الأخطاء
    private function handleException($e)
    {
        return response()->json([
            'message' => 'An unexpected error occurred.',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
}
