<?php

namespace App\Http\Middleware;

use Closure;

class Cors
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
        return $next($request)
            // クレデンシャルを必要とする場合、`Access-Control-Allow-Origin`にワイルドカードは
            // 使用できないので、動的に設定
            ->header('Access-Control-Allow-Origin', $request->header('origin'))
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
