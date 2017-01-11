<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Routing\Router;
use SleepingOwl\Admin\AliasBinder;
use Symfony\Component\Finder\Finder;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Widgets\WidgetsRegistry;
use SleepingOwl\Admin\Exceptions\TemplateException;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use Illuminate\Contracts\View\Factory as ViewFactory;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Model\ModelConfigurationManager;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use SleepingOwl\Admin\Contracts\Widgets\WidgetsRegistryInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

class AdminServiceProvider extends ServiceProvider
{
    /**
     * @var string
     */
    protected $directory;

    public function register()
    {
        $this->registerWysiwyg();
        $this->registerTemplate();
        $this->initializeNavigation();
        $this->registerAliases();

        $this->app->singleton('sleeping_owl.widgets', function () {
            return new WidgetsRegistry($this->app);
        });

        $this->app->booted(function () {
            $this->app['sleeping_owl.widgets']->placeWidgets(
                $this->app[ViewFactory::class]
            );
        });

        $this->app->booted(function () {
            $this->registerCustomRoutes();
            $this->registerDefaultRoutes();
            $this->registerNavigationFile();

            $this->app['sleeping_owl']->initialize();
        });

        ModelConfigurationManager::setEventDispatcher($this->app['events']);
    }

    protected function registerTemplate()
    {
        $this->app->singleton('assets.packages', function ($app) {
            return new \KodiCMS\Assets\PackageManager();
        });

        $this->app->singleton('sleeping_owl.meta', function ($app) {
            return new \SleepingOwl\Admin\Templates\Meta(
                new \KodiCMS\Assets\Assets(
                    $app['assets.packages']
                )
            );
        });

        $this->app->singleton('sleeping_owl.template', function ($app) {
            if (! class_exists($class = $this->getConfig('template'))) {
                throw new TemplateException("Template class [{$class}] not found");
            }

            return $app->make($class);
        });

        if (file_exists($assetsFile = __DIR__.'/../../resources/assets.php')) {
            include $assetsFile;
        }
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
        $this->registerMessages();
        $this->registerBootstrap();

        $this->registerRoutes(function (Router $route) {
            $route->group(['as' => 'admin.', 'namespace' => 'SleepingOwl\Admin\Http\Controllers'], function ($route) {
                $route->get('assets/admin.scripts', [
                    'as'   => 'scripts',
                    'uses' => 'AdminController@getScripts',
                ]);
            });
        });
    }

    protected function registerMessages()
    {
        $messageTypes = [
            'error' => \SleepingOwl\Admin\Widgets\Messages\ErrorMessages::class,
            'info' => \SleepingOwl\Admin\Widgets\Messages\InfoMessages::class,
            'success' => \SleepingOwl\Admin\Widgets\Messages\SuccessMessages::class,
            'warning' => \SleepingOwl\Admin\Widgets\Messages\WarningMessages::class,
        ];
        foreach ($messageTypes as $messageType) {
            $this->app[WidgetsRegistryInterface::class]->registerWidget($messageType);
        }

        $this->app->singleton('sleeping_owl.message', function () use ($messageTypes) {
            return new \SleepingOwl\Admin\Widgets\Messages\MessageStack($messageTypes);
        });
    }

    protected function initializeNavigation()
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
            return new \SleepingOwl\Admin\Wysiwyg\Manager($this->app);
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

        $files = Finder::create()
            ->files()
            ->name('/^.+\.php$/')
            ->notName('routes.php')
            ->notName('navigation.php')
            ->in($directory)
            ->sort(function ($a) {
                return $a->getFilename() != 'bootstrap.php';
            });

        foreach ($files as $file) {
            require $file;
        }
    }

    protected function registerAliases()
    {
        AliasLoader::getInstance(config('sleeping_owl.aliases', []));
    }

    protected function registerCustomRoutes()
    {
        if (file_exists($file = $this->getBootstrapPath('routes.php'))) {
            $this->registerRoutes(function (Router $route) use ($file) {
                require $file;
            });
        }
    }

    protected function registerDefaultRoutes()
    {
        $this->registerRoutes(function (Router $router) {
            $router->pattern('adminModelId', '[a-zA-Z0-9_-]+');

            $aliases = $this->app['sleeping_owl']->getModels()->keyByAlias();

            if ($aliases->count() > 0) {
                $router->pattern('adminModel', $aliases->keys()->implode('|'));

                $this->app['router']->bind('adminModel', function ($model, \Illuminate\Routing\Route $route) use ($aliases) {
                    if (is_null($model = $aliases->get($model))) {
                        throw new ModelNotFoundException;
                    }

                    if ($model->hasCustomControllerClass() && $route->getActionName() !== 'Closure') {
                        list($controller, $action) = explode('@', $route->getActionName(), 2);

                        $newController = $model->getControllerClass().'@'.$action;

                        $route->uses($newController);
                    }

                    return $model;
                });
            }

            if (file_exists($routesFile = __DIR__.'/../Http/routes.php')) {
                require $routesFile;
            }

            AliasBinder::registerRoutes($router);
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
        ], function ($route) use ($callback) {
            call_user_func($callback, $route);
        });
    }

    protected function registerNavigationFile()
    {
        if (file_exists($navigation = $this->getBootstrapPath('navigation.php'))) {
            $items = include $navigation;

            if (is_array($items)) {
                $this->app['sleeping_owl.navigation']->setFromArray($items);
            }
        }
    }
}
