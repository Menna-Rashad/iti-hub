<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications', function ($user) {
    return $user != null;
});
