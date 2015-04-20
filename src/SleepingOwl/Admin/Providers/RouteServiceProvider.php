<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use Route;
use SleepingOwl\Admin\Admin;

class RouteServiceProvider extends ServiceProvider
{

	public function register()
	{
		$this->registerPatterns();

		Route::group([
			'prefix'    => config('admin.prefix'),
			'namespace' => 'SleepingOwl\Admin\Http\Controllers'
		], function ()
		{
			require config('admin.bootstrapDirectory') . '/routes.php';
			require __DIR__ . '/../Http/routes.php';
		});
	}

	public static function registerRoutes($callback)
	{
		Route::group([
			'prefix' => config('admin.prefix'),
		], $callback);
	}

	protected function registerPatterns()
	{
		Route::pattern('adminModelId', '[0-9]+');
		Route::pattern('adminModel', implode('|', Admin::modelAliases()));
		Route::bind('adminModel', function ($model)
		{
			$class = array_search($model, Admin::modelAliases());
			return Admin::model($class);
		});
		Route::pattern('adminWildcard', '.*');
	}

}