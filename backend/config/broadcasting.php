<?php

return [
    'default' => env('BROADCAST_DRIVER', 'database'),

'connections' => [
    'database' => [
        'driver' => 'database',
        'connection' => null, // لا حاجة للاتصال بقاعدة بيانات أخرى هنا
    ],
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'useTLS' => true,
        ],
    ],
    // ... إضافات أخرى مثل redis
],


];