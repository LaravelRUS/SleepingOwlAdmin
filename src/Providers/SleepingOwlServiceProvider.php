<?php

namespace SleepingOwl\Admin\Providers;

use Collective\Html\FormFacade;
use Collective\Html\HtmlFacade;
use Collective\Html\HtmlServiceProvider;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use KodiCMS\Assets\AssetsServiceProvider;
use KodiCMS\Assets\Facades\Assets;
use KodiCMS\Assets\Facades\Meta;
use KodiCMS\Assets\Facades\PackageManager;
use KodiCMS\Navigation\Navigation;
use Route;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Column\Filter\ColumnFilter;
use SleepingOwl\Admin\Display\AdminDisplay;
use SleepingOwl\Admin\Facades\AdminSection;
use SleepingOwl\Admin\Filter\Filter;
use SleepingOwl\Admin\Form\AdminForm;
use SleepingOwl\Admin\FormItems\FormItem;

class SleepingOwlServiceProvider extends ServiceProvider
{

    public function register()
    {
        $this->app->singleton('sleeping_owl', function () {
            return new Admin();
        });

        $this->registerProviders();
        $this->registerAliases();
        $this->registerRoutePatterns();
    }

    public function boot()
    {
        $this->app->singleton('sleeping_owl.template', function () {
            return $this->app['sleeping_owl']->template();
        });

        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'sleeping_owl');
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');
        $this->mergeConfigFrom(__DIR__.'/../config/config.php', 'sleeping_owl');

        $this->publishes([
             __DIR__.'/../../public/' => public_path('packages/sleepingowl/'),
         ], 'assets');

        $this->publishes([
             __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
         ], 'config');

        if (file_exists($assetsFile = __DIR__.'/../../resources/asets.php')) {
            include $assetsFile;
        }
    }

    protected function registerRoutePatterns()
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

    public function registerProviders()
    {
        $providers = [
            ColumnFilterServiceProvider::class,
            ColumnServiceProvider::class,
            DisplayServiceProvider::class,
            FilterServiceProvider::class,
            FormServiceProvider::class,
            FormItemServiceProvider::class,
            AssetsServiceProvider::class,
            HtmlServiceProvider::class
        ];

        foreach ($providers as $providerClass) {
            $this->app->register($providerClass);
        }
    }

    public function registerAliases()
    {
        AliasLoader::getInstance([
            'AdminSection'            => AdminSection::class,
            'SleepingOwlColumn'       => Column::class,
            'SleepingOwlColumnFilter' => ColumnFilter::class,
            'SleepingOwlFilter'       => Filter::class,
            'AdminDisplay'            => AdminDisplay::class,
            'SleepingOwlForm'         => AdminForm::class,
            'SleepingOwlFormItem'     => FormItem::class,
            'Assets'                  => Assets::class,
            'PackageManager'          => PackageManager::class,
            'Meta'                    => Meta::class,
            'Form'                    => FormFacade::class,
            'HTML'                    => HtmlFacade::class,
        ]);
    }
}
