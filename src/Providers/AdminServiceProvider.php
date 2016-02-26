<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Form;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Display;
use SleepingOwl\Admin\Navigation;
use SleepingOwl\Admin\FormElement;
use SleepingOwl\Admin\TableColumn;
use SleepingOwl\Admin\DisplayFilter;
use Symfony\Component\Finder\Finder;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\TableColumnFilter;
use SleepingOwl\Admin\Facades\AdminSection;
use SleepingOwl\Admin\Facades\AdminTemplate;
use SleepingOwl\Admin\Facades\AdminNavigation;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AdminServiceProvider extends ServiceProvider
{
    protected $directory;

    public function register()
    {
        $this->app->singleton('sleeping_owl', function () {
            return new Admin();
        });

        $this->app->singleton('sleeping_owl.navigation', function () {
            return new Navigation();
        });

        $this->registerAliases();
    }

    /**
     * @param string $key
     *
     * @return mixed
     */
    protected function getConfig($key)
    {
        return $this->app['config']->get('sleeping_owl.'.$key);
    }

    /**
     * @param string $path
     *
     * @return string
     */
    protected function getBootstrapPath($path = null)
    {
        if (! is_null($path)) {
            $path = DIRECTORY_SEPARATOR.$path;
        }

        return $this->getConfig('bootstrapDirectory').$path;
    }

    public function boot()
    {
        $this->app->singleton('sleeping_owl.template', function () {
            return $this->app['sleeping_owl']->template();
        });

        $this->registerCustomRoutes();
        $this->registerBootstrap();
        $this->registerDefaultRoutes();

        if (file_exists($navigation = $this->getBootstrapPath('navigation.php'))) {
            $items = include $navigation;

            if (is_array($items)) {
                $this->app['sleeping_owl.navigation']->setFromArray($items);
            }
        }
    }

    /**
     * @return array
     */
    protected function registerBootstrap()
    {
        $directory = $this->getBootstrapPath();

        if (! is_dir($directory)) {
            return;
        }

        $files = $files = Finder::create()
            ->files()
            ->name('/^.+\.php$/')
            ->notName('routes.php')
            ->notName('navigation.php')
            ->in($directory)->sort(function ($a) {
                return $a->getFilename() != 'bootstrap.php';
            });


        foreach ($files as $file) {
            require $file;
        }
    }

    protected function registerAliases()
    {
        $aliasPrefix = config('sleeping_owl.alias_prefix', 'Admin');

        AliasLoader::getInstance([
            $aliasPrefix.'Section'       => AdminSection::class,
            $aliasPrefix.'Template'      => AdminTemplate::class,
            $aliasPrefix.'Navigation'    => AdminNavigation::class,
            $aliasPrefix.'Column'        => TableColumn::class,
            $aliasPrefix.'ColumnFilter'  => TableColumnFilter::class,
            $aliasPrefix.'DisplayFilter' => DisplayFilter::class,
            $aliasPrefix.'Form'          => Form::class,
            $aliasPrefix.'FormElement'   => FormElement::class,
            $aliasPrefix.'Display'       => Display::class
        ]);
    }

    protected function registerCustomRoutes()
    {
        if (file_exists($file = $this->getBootstrapPath('routes.php'))) {
            $this->registerRoutes(function() use($file) {
                require $file;
            });
        }
    }

    protected function registerDefaultRoutes()
    {
        $this->registerRoutes(function() {
            $this->app['router']->pattern('adminModelId', '[0-9]+');

            $aliases = $this->app['sleeping_owl']->modelAliases();

            if (count($aliases) > 0) {
                $this->app['router']->pattern('adminModel', implode('|', $aliases));

                $this->app['router']->bind('adminModel', function ($model) use ($aliases) {
                    $class = array_search($model, $aliases);

                    if ($class === false) {
                        throw new ModelNotFoundException;
                    }

                    return $this->app['sleeping_owl']->getModel($class);
                });
            }

            if (file_exists($routesFile = __DIR__.'/../Http/routes.php')) {
                require $routesFile;
            }
        });
    }

    /**
     * @param \Closure $callback
     */
    protected function registerRoutes(\Closure $callback)
    {
        $this->app['router']->group(['prefix' => $this->getConfig('prefix'), 'namespace' => 'SleepingOwl\Admin\Http\Controllers'], function () use($callback) {
            $this->app['router']->group(['middleware' => $this->getConfig('middleware')], function () use($callback) {
                $callback();
            });
        });
    }
}