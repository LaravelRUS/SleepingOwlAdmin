<?php

namespace SleepingOwl\Admin\Providers;

use Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{

    public function register()
    {
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
}