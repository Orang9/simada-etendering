<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles  Comma separated list of allowed role names
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $roles)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        $allowed = array_map('trim', explode(',', $roles));
        $roleName = optional($user->role)->nama_role;
        if (! $roleName || ! in_array($roleName, $allowed)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}
