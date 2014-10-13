<?php

Route::filter('admin.auth', function ()
{
	if (AdminAuth::guest())
	{
		if (Request::ajax())
		{
			return Response::make('Unauthorized', 401);
		} else
		{
			return Redirect::guest(Admin::instance()->router->routeToAuth('login'));
		}
	}
});