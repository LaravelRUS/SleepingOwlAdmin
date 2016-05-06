<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Commands\InstallCommand;
use SleepingOwl\Admin\Commands\UserManagerCommand;

class SleepingOwlServiceProvider extends ServiceProvider
{
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

    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');

        $this->publishes([
            __DIR__.'/../../public/' => public_path('packages/sleepingowl/'),
        ], 'assets');

        $this->publishes([
            __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
        ], 'config');
    }

    public function registerProviders()
    {
        foreach (config('sleeping_owl.providers', []) as $providerClass) {
            $this->app->register($providerClass);
        }
    }

    protected function registerCommands()
    {
        $commands = [
            InstallCommand::class,
            UserManagerCommand::class,
        ];

        foreach ($commands as $command) {
            $this->commands($command);
        }
    }
}
