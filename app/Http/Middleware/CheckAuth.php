<?php

namespace App\Http\Middleware;

use Closure;
use Session;
use Redirect;

class CheckAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Session::has('access_token') || config('app.use_test_account'))
        {
            return $next($request);
        }

        return response('Authorization required.', 401);
    }
}
