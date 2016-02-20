<?php

namespace SleepingOwl\Admin\Providers;

use Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RouteServiceProvider extends ServiceProvider
{

    public function register()
    {
        $this->registerPatterns();

        Route::group([
            'prefix'    => config('sleeping_owl.prefix'),
            'namespace' => 'SleepingOwl\Admin\Http\Controllers',
        ], function () {
            Route::group(['middleware' => config('sleeping_owl.middleware')], function () {
                if (file_exists($file = config('sleeping_owl.bootstrapDirectory').DIRECTORY_SEPARATOR.'routes.php')) {
                    require $file;
                }

                $routesFile = __DIR__.'/../Http/routes.php';
                if (file_exists($routesFile)) {
                    require $routesFile;
                }
            });
        });
    }

    public static function registerRoutes($callback)
    {
        Route::group([
            'prefix'     => config('sleeping_owl.prefix'),
            'middleware' => config('sleeping_owl.middleware'),
        ], $callback);
    }

    protected function registerPatterns()
    {
        Route::pattern('adminModelId', '[0-9]+');

        $aliases = $this->app['sleeping_owl']->modelAliases();

        if (count($aliases) > 0) {
            Route::pattern('adminModel', implode('|', $aliases));
            Route::bind('adminModel', function ($model) use ($aliases) {
                $class = array_search($model, $aliases);

                if ($class === false) {
                    throw new ModelNotFoundException;
                }

                return $this->app['sleeping_owl']->getModel($class);
            });
        }

        Route::pattern('adminWildcard', '.*');
    }
}