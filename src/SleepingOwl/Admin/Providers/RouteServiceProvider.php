<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\ServiceProvider;
use Route;
use SleepingOwl\Admin\Admin;

class RouteServiceProvider extends ServiceProvider
{

	public function register()
	{
		$this->registerPatterns();
		$this->registerMiddleware();

		Route::group([
			'prefix'    => config('admin.prefix'),
			'namespace' => 'SleepingOwl\Admin\Http\Controllers',
		], function ()
		{
			Route::group([
				'middleware' => config('admin.middleware'),
			], function ()
			{
				$file = config('admin.bootstrapDirectory') . '/routes.php';
				if (file_exists($file))
				{
					require $file;
				}
			});
			$routesFile = __DIR__ . '/../Http/routes.php';
			if (file_exists($routesFile))
			{
				require $routesFile;
			}
		});
	}

	public static function registerRoutes($callback)
	{
		Route::group([
			'prefix'     => config('admin.prefix'),
			'middleware' => config('admin.middleware'),
		], $callback);
	}

	protected function registerPatterns()
	{
		Route::pattern('adminModelId', '[0-9]+');
		Route::pattern('adminModel', implode('|', Admin::modelAliases()));
		Route::bind('adminModel', function ($model)
		{
			$class = array_search($model, Admin::modelAliases());
			if ($class === false)
			{
				throw new ModelNotFoundException;
			}
			return Admin::model($class);
		});
		Route::pattern('adminWildcard', '.*');
	}

	protected function registerMiddleware()
	{
		Route::middleware('admin.auth', 'SleepingOwl\Admin\Http\Middleware\Authenticate');
	}

}