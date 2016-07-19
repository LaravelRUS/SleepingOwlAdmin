<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Html\HtmlServiceProvider;
use Illuminate\Support\ServiceProvider;
use KodiCMS\Assets\AssetsServiceProvider;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Commands\InstallCommand;
use SleepingOwl\Admin\Commands\SectionGenerate;
use SleepingOwl\Admin\Commands\SectionMake;
use SleepingOwl\Admin\Commands\UserManagerCommand;
use DaveJamesMiller\Breadcrumbs\ServiceProvider as BreadcrumbsServiceProvider;

class SleepingOwlServiceProvider extends ServiceProvider
{
    /** @var array Associative array in form of: Model => Section */
    protected $sections = [];

    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../../config/sleeping_owl.php', 'sleeping_owl');
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'sleeping_owl');

        $this->registerProviders();
        $this->registerCommands();

        if (file_exists($assetsFile = __DIR__.'/../../resources/assets.php')) {
            include $assetsFile;
        }
    }

    public function boot(Admin $admin)
    {
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');

        $this->publishes([
            __DIR__.'/../../public/' => public_path('packages/sleepingowl/'),
        ], 'assets');

        $this->publishes([
            __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
        ], 'config');

        foreach ($this->sections as $model => $section) {
            if (class_exists($section)) {
                $admin->register(new $section($model));
            }
        }
    }

    public function registerProviders()
    {
        $providers = [
            AliasesServiceProvider::class,
            AssetsServiceProvider::class,
            HtmlServiceProvider::class,
            BreadcrumbsServiceProvider::class,
            AdminServiceProvider::class,
        ];

        foreach ($providers as $providerClass) {
            $this->app->register($providerClass);
        }
    }

    protected function registerCommands()
    {
        $this->commands([
            InstallCommand::class,
            UserManagerCommand::class,
            SectionGenerate::class,
            SectionMake::class,
        ]);
    }
}
