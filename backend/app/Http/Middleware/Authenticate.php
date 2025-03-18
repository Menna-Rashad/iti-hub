<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
    {
        return null; // ✅ ده اللي يمنع Laravel من محاولة redirect لصفحة login
    }
}
