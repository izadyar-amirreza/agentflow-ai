<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is logged in and is an admin
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            // Kick them out with a 403 Forbidden error
            abort(403, 'Access Denied. Admins only.');
        }

        return $next($request);
    }
}