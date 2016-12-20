<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\AliasBinder;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Widgets\WidgetsRegistry;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Exceptions\TemplateException;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Contracts\View\Factory as ViewFactory;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Model\ModelConfigurationManager;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygMangerInterface;
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
        $this->registerAliases();
        $this->initializeNavigation();
        $this->initializeAssets();

        $this->app->singleton('sleeping_owl.template', function ($app) {
            if (! class_exists($class = $this->getConfig('template'))) {
                throw new TemplateException("Template class [{$class}] not found");
            }

            return $app->make($class);
        });

        $this->app->alias('sleeping_owl.template', \SleepingOwl\Admin\Contracts\Template\TemplateInterface::class);

        $this->app->singleton('sleeping_owl', function ($app) {
            return new \SleepingOwl\Admin\Admin(
                $app['sleeping_owl.template'], $app
            );
        });

        $this->app->alias('sleeping_owl', \SleepingOwl\Admin\Contracts\AdminInterface::class);

        $this->registerWysiwyg();

        $this->app->singleton(WidgetsRegistryInterface::class, function () {
            return new WidgetsRegistry($this->app);
        });

        $this->app->booted(function () {
            $this->app[WidgetsRegistryInterface::class]->placeWidgets(
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

    /**
     * @param WidgetsRegistryInterface $widgetsRegistry
     */
    public function boot(WidgetsRegistryInterface $widgetsRegistry)
    {
        $this->registerMessages($widgetsRegistry);

        $this->registerRoutes(function (Router $route) {
            $route->group(['as' => 'admin.', 'namespace' => 'SleepingOwl\Admin\Http\Controllers'], function ($route) {
                $route->get('assets/admin.scripts', [
                    'as'   => 'scripts',
                    'uses' => 'AdminController@getScripts',
                ]);
            });
        });
    }

    /**
     * @param WidgetsRegistryInterface $widgetsRegistry
     */
    protected function registerMessages(WidgetsRegistryInterface $widgetsRegistry)
    {
        $messageTypes = [
            'error' => \SleepingOwl\Admin\Widgets\Messages\ErrorMessages::class,
            'info' => \SleepingOwl\Admin\Widgets\Messages\InfoMessages::class,
            'success' => \SleepingOwl\Admin\Widgets\Messages\SuccessMessages::class,
            'warning' => \SleepingOwl\Admin\Widgets\Messages\WarningMessages::class,
        ];

        foreach ($messageTypes as $messageType) {
            $widgetsRegistry->registerWidget($messageType);
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

        $this->app->alias('sleeping_owl.navigation', NavigationInterface::class);
    }

    protected function initializeAssets()
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

        $this->app->alias('sleeping_owl.meta', MetaInterface::class);
    }

    protected function registerWysiwyg()
    {
        $this->app->singleton('sleeping_owl.wysiwyg', function ($app) {
            return new \SleepingOwl\Admin\Wysiwyg\Manager(
                $app['sleeping_owl.meta']
            );
        });

        $this->app->alias('sleeping_owl.wysiwyg', WysiwygMangerInterface::class);
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

            /** @var Collection $models */
            $models = $this->app['sleeping_owl']->getModels();

            if ($models->count() > 0) {
                $router->pattern('adminModel', $models->keys()->implode('|'));

                $this->app['router']->bind('adminModel', function ($alias, \Illuminate\Routing\Route $route) use ($models) {
                    /** @var ModelConfiguration $model */
                    $model = $models->get($alias);

                    if (is_null($model)) {
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

            foreach (AliasBinder::routes() as $route) {
                $this->app->call($route);
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
