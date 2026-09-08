<?php

namespace SleepingOwl\Admin\Providers;

use Closure;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Assets\AssetAliasNormalizer;
use SleepingOwl\Admin\Assets\AssetDependencySorter;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestRegistry;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetPackageRegistry;
use SleepingOwl\Admin\Assets\AssetProfileSelector;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\AssetRenderer;
use SleepingOwl\Admin\Assets\AssetVersionMatcher;
use SleepingOwl\Admin\Assets\ComposerPackageVersion;
use SleepingOwl\Admin\Assets\HtmlAttributes;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Assets\MetaRenderer;
use SleepingOwl\Admin\Assets\PublishedAssetHealth;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Contracts\Widgets\WidgetsRegistryInterface;
use SleepingOwl\Admin\Model\ModelConfigurationManager;
use SleepingOwl\Admin\Navigation;
use SleepingOwl\Admin\Routing\ModelRouter;
use SleepingOwl\Admin\Templates\Assets;
use SleepingOwl\Admin\Templates\Meta;
use SleepingOwl\Admin\Themes\ExternalThemeAssets;
use SleepingOwl\Admin\Themes\ThemeConfiguration;
use SleepingOwl\Admin\Themes\ThemeCssVariables;
use SleepingOwl\Admin\Themes\ThemeRegistry;
use SleepingOwl\Admin\Themes\ThemeResolver;
use SleepingOwl\Admin\Themes\ThemeSelection;
use SleepingOwl\Admin\Widgets\EnvEditor;
use SleepingOwl\Admin\Widgets\Messages\ErrorMessages;
use SleepingOwl\Admin\Widgets\Messages\InfoMessages;
use SleepingOwl\Admin\Widgets\Messages\MessageStack;
use SleepingOwl\Admin\Widgets\Messages\SuccessMessages;
use SleepingOwl\Admin\Widgets\Messages\WarningMessages;
use SleepingOwl\Admin\Widgets\WidgetsRegistry;
use SleepingOwl\Admin\Wysiwyg\Manager;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;

class AdminServiceProvider extends ServiceProvider
{
    /**
     * @var string
     */
    protected $directory;

    /**
     * All global widgets.
     *
     * @var array
     */
    protected $widgets = [
        EnvEditor::class,
    ];

    public function register(): void
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
            $this->registerSupportRoutes();
            $this->registerNavigationFile();

            $this->initializeAdmin();
        });

        ModelConfigurationManager::setEventDispatcher($this->app['events']);
    }

    private function initializeAdmin(): void
    {
        if ($this->awaitingInitialAssetPublish()) {
            return;
        }

        $this->app['sleeping_owl']->initialize();
    }

    private function awaitingInitialAssetPublish(): bool
    {
        return $this->app->runningInConsole()
            && ! $this->app['files']->exists(
                $this->app->publicPath('packages/sleepingowl/default/asset-manifest.json')
            );
    }

    protected function registerTemplate(): void
    {
        $this->registerAssetServices();

        $this->app->singleton('sleeping_owl.theme.config', function (Application $app) {
            return new ThemeConfiguration($app['config']);
        });
        $this->app->alias('sleeping_owl.theme.config', ThemeConfiguration::class);

        $this->app->singleton(ThemeCssVariables::class, function (Application $app) {
            return new ThemeCssVariables($app->make(ThemeConfiguration::class));
        });

        $this->app->singleton(AssetManifestLoader::class, function (Application $app) {
            return new AssetManifestLoader($app['files']);
        });

        $this->app->singleton(AssetProfileSelector::class, function (Application $app) {
            return new AssetProfileSelector($app['config']);
        });

        $this->app->singleton(AssetManifestRegistry::class);
        $this->app->singleton(ExternalThemeAssets::class);
        $this->app->singleton(ThemeRegistry::class);

        $this->app->singleton(ComposerPackageVersion::class);
        $this->app->singleton(AssetVersionMatcher::class);
        $this->app->singleton(AssetManifest::class, function (Application $app) {
            return $app->make(AssetManifestLoader::class)->load(
                $app->publicPath('packages/sleepingowl/default/asset-manifest.json')
            );
        });
        $this->app->scoped(PublishedAssetHealth::class);
        $this->app->singleton(PublishedAssetVerifier::class, function (Application $app) {
            return new PublishedAssetVerifier(
                $app['files'],
                $app->make(AssetManifestLoader::class),
                $app->make(AssetProfileSelector::class),
                $app->make(ComposerPackageVersion::class),
                $app->make(AssetVersionMatcher::class)
            );
        });

        $this->app->singleton(AssetManifestResolver::class, function (Application $app) {
            return new AssetManifestResolver(
                $app->make(AssetManifest::class),
                $app->make(UrlGenerator::class),
                'packages/sleepingowl/default',
                $app->make(AssetProfileSelector::class)->selected(),
                $app->make(AssetManifestRegistry::class)
            );
        });
        $this->app->singleton(LogicalAssetRegistrar::class);

        $this->app->singleton(ThemeSelection::class, function (Application $app) {
            return (new ThemeResolver($app, $app->make(ThemeRegistry::class)))
                ->resolve($this->getConfig('template'));
        });

        $this->app->singleton('sleeping_owl.template', function (Application $app) {
            return $app->make(ThemeSelection::class)->template();
        });

        $this->app->singleton('sleeping_owl.theme', function (Application $app) {
            return $app->make(ThemeSelection::class)->theme();
        });
        $this->app->alias('sleeping_owl.theme', ThemeInterface::class);

        if (file_exists($assetsFile = __DIR__.'/../../resources/assets.php')) {
            include $assetsFile;
        }
    }

    protected function registerAssetServices(): void
    {
        $this->app->singleton(AssetDependencySorter::class);
        $this->app->singleton(AssetAliasNormalizer::class);
        $this->app->singleton(HtmlAttributes::class);
        $this->app->singleton(AssetPackageRegistry::class);
        $this->app->alias(AssetPackageRegistry::class, 'assets.packages');

        $this->app->singleton(AssetRegistry::class, function (Application $app) {
            return new AssetRegistry($app->make(AssetDependencySorter::class));
        });

        $this->app->singleton(AssetRenderer::class, function (Application $app) {
            return new AssetRenderer(
                $app->make(UrlGenerator::class),
                $app->make(HtmlAttributes::class)
            );
        });

        $this->app->singleton(MetaRenderer::class, function (Application $app) {
            return new MetaRenderer($app->make(HtmlAttributes::class));
        });

        $this->app->singleton('assets', function (Application $app) {
            return new Assets(
                $app->make(AssetPackageRegistry::class),
                $app->make(AssetRegistry::class),
                $app->make(AssetRenderer::class)
            );
        });

        $this->app->singleton('sleeping_owl.meta', function (Application $app) {
            return new Meta(
                $app['assets'],
                $app->make(MetaRenderer::class)
            );
        });
    }

    /**
     * @param  string  $key
     * @return mixed
     */
    protected function getConfig($key)
    {
        return $this->app['config']->get('sleeping_owl.'.$key);
    }

    /**
     * @param  string  $path
     * @return string
     */
    protected function getBootstrapPath($path = null)
    {
        if (! is_null($path)) {
            $path = DIRECTORY_SEPARATOR.$path;
        }

        return $this->getConfig('bootstrapDirectory').$path;
    }

    public function boot(): void
    {
        $this->registerMessages();
        $this->registerBootstrap();
        $this->registerWidgets();
    }

    /**
     * Global register widgets.
     */
    protected function registerWidgets(): void
    {
        $widgetsRegistry = $this->app[WidgetsRegistryInterface::class];

        foreach ($this->widgets as $widget) {
            $widgetsRegistry->registerWidget($widget);
        }
    }

    /**
     * Global register messages of adminpanel.
     */
    protected function registerMessages(): void
    {
        $messageTypes = [
            'error' => ErrorMessages::class,
            'info' => InfoMessages::class,
            'success' => SuccessMessages::class,
            'warning' => WarningMessages::class,
        ];
        foreach ($messageTypes as $messageType) {
            $this->app[WidgetsRegistryInterface::class]->registerWidget($messageType);
        }

        $this->app->singleton('sleeping_owl.message', function () use ($messageTypes) {
            return new MessageStack($messageTypes);
        });
    }

    protected function initializeNavigation(): void
    {
        $this->app->bind(
            TableHeaderColumnInterface::class,
            \SleepingOwl\Admin\Display\TableHeaderColumn::class
        );

        $this->app->bind(
            RepositoryInterface::class,
            \SleepingOwl\Admin\Repositories\BaseRepository::class
        );

        $this->app->bind(
            FormButtonsInterface::class,
            \SleepingOwl\Admin\Form\FormButtons::class
        );

        $this->app->bind(
            \SleepingOwl\Admin\Contracts\Navigation\PageInterface::class,
            \SleepingOwl\Admin\Navigation\Page::class
        );

        $this->app->bind(
            \SleepingOwl\Admin\Contracts\Navigation\BadgeInterface::class,
            \SleepingOwl\Admin\Navigation\Badge::class
        );

        $this->app->singleton('sleeping_owl.navigation', function () {
            return new Navigation();
        });
    }

    protected function registerWysiwyg(): void
    {
        $this->app->singleton('sleeping_owl.wysiwyg', function () {
            return new Manager($this->app);
        });
    }

    /**
     * Register bootstrap file.
     */
    protected function registerBootstrap(): void
    {
        $directory = $this->getBootstrapPath();

        if (! is_dir($directory)) {
            return;
        }

        $files = Finder::create()
            ->files()
            ->name('/^.+\.php$/')
            ->notName('routes.php')
            ->notName('*.blade.php')
            ->notName('navigation.php')
            ->in($directory)
            ->sort(function (SplFileInfo $a) {
                return $a->getFilename() === 'bootstrap.php' ? -1 : 1;
            });

        foreach ($files as $file) {
            require_once $file;
        }
    }

    /**
     * Register Alias from App.
     */
    protected function registerAliases(): void
    {
        $aliases = $this->app->make(AssetAliasNormalizer::class)->normalize(
            config('sleeping_owl.aliases', [])
        );

        $this->app['config']->set('sleeping_owl.aliases', $aliases);
        AliasLoader::getInstance($aliases);
    }

    /**
     * Register Custom Routes From Users.
     */
    protected function registerCustomRoutes(): void
    {
        if (file_exists($file = $this->getBootstrapPath('routes.php'))) {
            $this->registerRoutes(function (Router $router) use ($file) {
                require $file;
            });
        }
    }

    /**
     * Register Default Admin Routes.
     */
    protected function registerDefaultRoutes(): void
    {
        $this->registerRoutes(function (Router $router) {
            (new ModelRouter($this->app, $router))->register($this->app['sleeping_owl']->getModels());

            if (file_exists($routesFile = __DIR__.'/../Http/routes.php')) {
                require $routesFile;
            }

            AliasBinder::registerRoutes($router);
        });
    }

    /**
     * Register CKEditor Upload and D&D plugins.
     */
    protected function registerSupportRoutes(): void
    {
        $domain = config('sleeping_owl.domain', false);

        $middlewares = collect($this->getConfig('middleware'));
        $configGroup = collect([
            'prefix' => $this->getConfig('url_prefix'),
            'middleware' => $middlewares,
        ]);

        if ($domain) {
            $configGroup->put('domain', $domain);
        }

        $this->app['router']->group($configGroup->toArray(), function (Router $route) {
            $route->get('ckeditor/upload/image', [
                'as' => 'admin.ckeditor.upload',
                'uses' => 'SleepingOwl\Admin\Http\Controllers\UploadController@ckEditorStore',
            ]);

            $route->post('ckeditor/upload/image', [
                'uses' => 'SleepingOwl\Admin\Http\Controllers\UploadController@ckEditorStore',
            ]);
        });
    }

    /**
     * @param  Closure  $callback
     */
    protected function registerRoutes(Closure $callback): void
    {
        $domain = config('sleeping_owl.domain', false);
        $configGroup = collect([
            'prefix' => $this->getConfig('url_prefix'),
            'middleware' => $this->getConfig('middleware'),
        ]);

        if ($domain) {
            $configGroup->put('domain', $domain);
        }

        $this->app['router']->group($configGroup->toArray(), function (Router $route) use ($callback) {
            call_user_func($callback, $route);
        });
    }

    /**
     * Register navigation file.
     */
    protected function registerNavigationFile(): void
    {
        if (file_exists($navigation = $this->getBootstrapPath('navigation.php'))) {
            $items = include $navigation;

            if (is_array($items)) {
                $this->app['sleeping_owl.navigation']->setFromArray($items);
            }
        }
    }
}
