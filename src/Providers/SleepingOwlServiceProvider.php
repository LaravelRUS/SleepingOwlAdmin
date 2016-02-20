<?php

namespace SleepingOwl\Admin\Providers;

use Collective\Html\FormFacade;
use Collective\Html\HtmlFacade;
use KodiCMS\Assets\Facades\Meta;
use KodiCMS\Assets\Facades\Assets;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use Collective\Html\HtmlServiceProvider;
use KodiCMS\Assets\AssetsServiceProvider;
use KodiCMS\Assets\Facades\PackageManager;
use SleepingOwl\Admin\Commands\InstallCommand;

class SleepingOwlServiceProvider extends ServiceProvider
{

    public function register()
    {
        $this->registerProviders();
        $this->registerAliases();
        $this->registerCommands();
    }

    public function boot()
    {
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'sleeping_owl');
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');
        $this->mergeConfigFrom(__DIR__.'/../../config/sleeping_owl.php', 'sleeping_owl');

        $this->publishes([
            __DIR__.'/../../public/' => public_path('packages/sleepingowl/'),
        ], 'assets');

        $this->publishes([
            __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
        ], 'config');

        if (file_exists($assetsFile = __DIR__.'/../../resources/assets.php')) {
            include $assetsFile;
        }
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
            HtmlServiceProvider::class,
            AdminServiceProvider::class,
            RouteServiceProvider::class
        ];

        foreach ($providers as $providerClass) {
            $this->app->register($providerClass);
        }
    }

    public function registerAliases()
    {
        AliasLoader::getInstance([
            'Assets'            => Assets::class,
            'PackageManager'    => PackageManager::class,
            'Meta'              => Meta::class,
            'Form'              => FormFacade::class,
            'HTML'              => HtmlFacade::class,
        ]);
    }

    protected function registerCommands()
    {
        $commands = [
            InstallCommand::class
        ];

        foreach ($commands as $command) {
            $this->commands($command);
        }
    }
}
