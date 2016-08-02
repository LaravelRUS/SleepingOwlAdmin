<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Contracts\Config\Repository as Config;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\ConnectionResolverInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Schema\Builder;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router as IlluminateRouter;
use Illuminate\Support\ServiceProvider;
use KodiComponents\Navigation\Contracts\BadgeInterface;
use KodiComponents\Navigation\Contracts\PageInterface;
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
use SleepingOwl\Admin\Display\TableHeaderColumn;
use SleepingOwl\Admin\Form\FormButtons;
use SleepingOwl\Admin\Http\Router;
use SleepingOwl\Admin\Navigation;
use SleepingOwl\Admin\Navigation\Badge;
use SleepingOwl\Admin\Navigation\Page;
use SleepingOwl\Admin\Repository\BaseRepository;
use SleepingOwl\Admin\Templates\TemplateDefault;
use SleepingOwl\Admin\Wysiwyg\Manager;
use Symfony\Component\Finder\Finder;

class AdminServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->registerTemplate();
        $this->registerNavigation();
        $this->registerAdminSingleton();
        $this->registerRouter();
        $this->registerWysiwyg();
        $this->registerAliases();
        $this->registerBindings();

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

    protected function registerNavigation()
    {
        $this->app->bind(PageInterface::class, Page::class);
        $this->app->bind(BadgeInterface::class, Badge::class);

        $this->app->singleton('sleeping_owl.navigation', Navigation::class);
        $this->app->alias('sleeping_owl.navigation', NavigationInterface::class);
    }

    protected function registerBindings()
    {
        $this->app->bind(TableHeaderColumnInterface::class, TableHeaderColumn::class);
        $this->app->bind(RepositoryInterface::class, BaseRepository::class);
        $this->app->bind(FormButtonsInterface::class, FormButtons::class);

        $this->app->when(RepositoryInterface::class)
            ->needs(Builder::class)
            ->give(function (Container $app) {
                /** @var ConnectionResolverInterface $db */
                $db = $app['db'];
                return $db->connection($db->getDefaultConnection())->getSchemaBuilder();
            });
    }

    protected function registerTemplate()
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
    }

    protected function registerAdminSingleton()
    {
        $this->app->singleton('sleeping_owl', function (Container $app) {
            return $app->make(Admin::class, [
                'templateClass' => $this->getConfig('template')
            ]);
        });
        $this->app->alias('sleeping_owl', AdminInterface::class);
    }

    protected function registerRouter()
    {
        $this->app->singleton('sleeping_owl.router', function (Container $app) {
            return $app->make(Router::class, [
                'urlPrefix' => $this->getConfig('url_prefix'),
                'middleware' => $this->getConfig('middleware'),
            ]);
        });
        $this->app->alias('sleeping_owl.router', RouterInterface::class);
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
