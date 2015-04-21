<?php namespace SleepingOwl\Admin\Http\Middleware;

use AdminAuth;
use Closure;

class Authenticate
{

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Closure $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		if (AdminAuth::guest())
		{
			if ($request->ajax())
			{
				return response('Unauthorized.', 401);
			} else
			{
				return redirect()->guest(route('admin.login'));
			}
		}

		return $next($request);
	}

}
