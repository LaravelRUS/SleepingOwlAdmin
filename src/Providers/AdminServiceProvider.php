<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Contracts\Config\Repository as Config;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router as IlluminateRouter;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\NavigationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\RouterInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\ManagerInterface;
use SleepingOwl\Admin\Http\Router;
use SleepingOwl\Admin\Templates\TemplateDefault;
use SleepingOwl\Admin\Wysiwyg\Manager;
use Symfony\Component\Finder\Finder;

class AdminServiceProvider extends ServiceProvider
{
    protected $directory;

    public function register()
    {
        $this->app->singleton('sleeping_owl.template', function (Container $app) {
            $breadcrumbs = $this->getConfig('breadcrumbs') ? $app->make('breadcrumbs') : false;

            $template = $app->make($this->getConfig('template', TemplateDefault::class), [
                'breadcrumbs' => $breadcrumbs,
            ]);

            if (method_exists($template, 'boot')) {
                $this->app->booted(function (Container $app) use ($template) {
                    $app->call([$template, 'boot']);
                });
            }

            return $template;
        });
        $this->app->alias('sleeping_owl.template', TemplateInterface::class);

        $this->initializeNavigation();

        $this->app->singleton('sleeping_owl', function (Container $app) {
            return $app->make(Admin::class, [
                'templateClass' => $this->getConfig('template')
            ]);
        });
        $this->app->alias('sleeping_owl', AdminInterface::class);

        $this->app->singleton('sleeping_owl.router', function (Container $app) {
            return $app->make(Router::class, [
                'urlPrefix' => $this->getConfig('url_prefix'),
                'middleware' => $this->getConfig('middleware'),
            ]);
        });
        $this->app->alias('sleeping_owl.router', RouterInterface::class);

        $this->registerWysiwyg();
        $this->registerAliases();

        $this->app->booted(function () {
            $this->registerCustomRoutes();
            $this->registerDefaultRoutes();
            $this->registerNavigationFile();
        });
    }

    /**
     * @param string $key
     *
     * @param null $default
     * @return mixed
     */
    protected function getConfig($key, $default = null)
    {
        return $this->app->make(Config::class)->get('sleeping_owl.' . $key, $default);
    }

    /**
     * @param string $path
     *
     * @return string
     */
    protected function getBootstrapPath($path = null)
    {
        if (!is_null($path)) {
            $path = DIRECTORY_SEPARATOR . $path;
        }

        return $this->getConfig('bootstrapDirectory') . $path;
    }

    public function boot()
    {
        $this->registerBootstrap();

        $this->app->make(RouterInterface::class)->register(function (IlluminateRouter $router) {
            $router->group(['as' => 'admin.', 'namespace' => 'SleepingOwl\Admin\Http\Controllers'],
                function (IlluminateRouter $router) {
                    $router->get('assets/admin.scripts', [
                        'as' => 'scripts',
                        'uses' => 'AdminController@getScripts',
                    ]);
                });
        });

    }

    protected function initializeNavigation()
    {
        $this->app->bind(TableHeaderColumnInterface::class, \SleepingOwl\Admin\Display\TableHeaderColumn::class);
        $this->app->bind(RepositoryInterface::class, \SleepingOwl\Admin\Repository\BaseRepository::class);
        $this->app->bind(FormButtonsInterface::class, \SleepingOwl\Admin\Form\FormButtons::class);

        $this->app->bind(\KodiComponents\Navigation\Contracts\PageInterface::class, \SleepingOwl\Admin\Navigation\Page::class);
        $this->app->bind(\KodiComponents\Navigation\Contracts\BadgeInterface::class, \SleepingOwl\Admin\Navigation\Badge::class);

        $this->app->singleton('sleeping_owl.navigation', \SleepingOwl\Admin\Navigation::class);
        $this->app->alias('sleeping_owl.navigation', NavigationInterface::class);
    }

    protected function registerWysiwyg()
    {
        $this->app->singleton('sleeping_owl.wysiwyg', function (Container $app) {
            return $app->make(Manager::class, [
                'config' => $this->getConfig('wysiwyg', []),
                'defaultEditor' => $this->getConfig('wysiwyg.default', 'ckeditor'),
            ]);
        });
        $this->app->alias('sleeping_owl.wysiwyg', ManagerInterface::class);
    }

    protected function registerBootstrap()
    {
        $directory = $this->getBootstrapPath();

        if (!is_dir($directory)) {
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
        AliasLoader::getInstance($this->getConfig('aliases', []));
    }

    protected function registerCustomRoutes()
    {
        if (file_exists($file = $this->getBootstrapPath('routes.php'))) {
            $this->app->make(RouterInterface::class)->register(function (IlluminateRouter $router) use ($file) {
                require $file;
            });
        }
    }

    protected function registerDefaultRoutes()
    {
        $this->app->make(RouterInterface::class)->register(function (IlluminateRouter $router) {
            /** @var AdminInterface $admin */
            $admin = $this->app->make(AdminInterface::class);

            $router->pattern('adminModelId', '[a-zA-Z0-9_-]+');
            $aliases = $admin->modelAliases();

            if (count($aliases) > 0) {
                $router->pattern('adminModel', implode('|', $aliases));

                $router->bind('adminModel', function ($model, Route $route) use ($aliases, $admin) {
                    $class = array_search($model, $aliases);

                    if ($class === false) {
                        throw new ModelNotFoundException;
                    }

                    $model = $admin->getModel($class);

                    if ($model->hasCustomControllerClass()) {
                        list($controller, $action) = explode('@', $route->getActionName(), 2);

                        $newController = $model->getControllerClass() . '@' . $action;

                        $route->uses($newController);
                    }

                    return $model;
                });
            }

            if (file_exists($routesFile = __DIR__ . '/../Http/routes.php')) {
                require $routesFile;
            }

            foreach (AliasBinder::routes() as $route) {
                $this->app->call($route);
            }
        });
    }

    protected function registerNavigationFile()
    {
        if (file_exists($navigation = $this->getBootstrapPath('navigation.php'))) {
            $items = include $navigation;

            if (is_array($items)) {
                $this->app->make(NavigationInterface::class)->setFromArray($items);
            }
        }
    }
}
