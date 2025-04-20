<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleTooManyRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->getStatusCode() === 429) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again after 1 minute.',
            ], 429);
        }

        return $response;
    }
}