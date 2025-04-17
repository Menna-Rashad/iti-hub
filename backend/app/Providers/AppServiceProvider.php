<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
{
    ResetPassword::createUrlUsing(function (User $user, string $token) {
        return 'http://localhost:4200/reset-password?token=' . $token . '&email=' . $user->email;
    });
}

}
