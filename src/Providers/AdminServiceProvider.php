<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Admin;
use Symfony\Component\Finder\Finder;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

class AdminServiceProvider extends ServiceProvider
{
    protected $directory;

    public function register()
    {
        $this->app->singleton('sleeping_owl', function () {
            return new Admin();
        });

        $this->registerNavigation();
        $this->registerWysiwyg();
        $this->registerAliases();

        ModelConfiguration::setEventDispatcher($this->app['events']);
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

    protected function registerNavigation()
    {
        $this->app->bind(TableHeaderColumnInterface::class, \SleepingOwl\Admin\Display\TableHeaderColumn::class);
        $this->app->bind(RepositoryInterface::class, \SleepingOwl\Admin\Repository\BaseRepository::class);
        $this->app->bind(FormButtonsInterface::class, \SleepingOwl\Admin\Form\FormButtons::class);

        $this->app->bind(\KodiComponents\Navigation\Contracts\PageInterface::class, \SleepingOwl\Admin\Navigation\Page::class);
        $this->app->bind(\KodiComponents\Navigation\Contracts\BadgeInterface::class, \SleepingOwl\Admin\Navigation\Badge::class);

        $this->app->singleton('sleeping_owl.navigation', function () {
            return new \SleepingOwl\Admin\Navigation();
        });
    }

    protected function registerWysiwyg()
    {
        $this->app->singleton('sleeping_owl.wysiwyg', function () {
            return new \SleepingOwl\Admin\Wysiwyg\Manager();
        });
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
            require_once $file;
        }
    }

    protected function registerAliases()
    {
        AliasLoader::getInstance(config('sleeping_owl.aliases', []));
    }

    protected function registerCustomRoutes()
    {
        if (file_exists($file = $this->getBootstrapPath('routes.php'))) {
            $this->registerRoutes(function () use ($file) {
                require_once $file;
            });
        }
    }

    protected function registerDefaultRoutes()
    {
        $this->registerRoutes(function () {
            $this->app['router']->pattern('adminModelId', '[0-9]+');

            $aliases = $this->app['sleeping_owl']->modelAliases();

            if (count($aliases) > 0) {
                $this->app['router']->pattern('adminModel', implode('|', $aliases));

                $this->app['router']->bind('adminModel', function ($model, \Illuminate\Routing\Route $route) use ($aliases) {
                    $class = array_search($model, $aliases);

                    if ($class === false) {
                        throw new ModelNotFoundException;
                    }

                    /** @var ModelConfiguration $model */
                    $model = $this->app['sleeping_owl']->getModel($class);

                    if ($model->hasCustomControllerClass()) {
                        list($controller, $action) = explode('@', $route->getActionName(), 2);

                        $newController = $model->getControllerClass().'@'.$action;

                        $route->uses([
                            'uses' => $newController,
                            'controller' => $newController,
                        ]);
                    }

                    return $model;
                });
            }

            if (file_exists($routesFile = __DIR__.'/../Http/routes.php')) {
                require_once $routesFile;
            }
        });
    }

    /**
     * @param \Closure $callback
     */
    protected function registerRoutes(\Closure $callback)
    {
        $this->app['router']->group([
            'prefix' => $this->getConfig('url_prefix'),
            'middleware' => $this->getConfig('middleware'),
        ], function () use ($callback) {

            call_user_func($callback);

        });
    }
}
