<?php

namespace SleepingOwl\Admin\Providers;

class SleepingOwlServiceProvider extends AdminSectionsServiceProvider
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

    /**
     * @param \SleepingOwl\Admin\Admin $admin
     */
    public function boot(\SleepingOwl\Admin\Admin $admin)
    {
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');

        $this->publishes([
            __DIR__.'/../../public/' => public_path('packages/sleepingowl/'),
        ], 'assets');

        $this->publishes([
            __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
        ], 'config');

        parent::boot($admin);
    }

    public function registerProviders()
    {
        $providers = [
            AliasesServiceProvider::class,
            \KodiCMS\Assets\AssetsServiceProvider::class,
            \Collective\Html\HtmlServiceProvider::class,
            \DaveJamesMiller\Breadcrumbs\ServiceProvider::class,
            AdminServiceProvider::class,
        ];

        foreach ($providers as $providerClass) {
            $this->app->register($providerClass);
        }

        /* Workaround to allow use ServiceProvider-based configurations in old fashion */
        if (is_file(app_path('Providers/AdminSectionsServiceProvider.php'))) {
            $this->app->register(\App\Providers\AdminSectionsServiceProvider::class);
        }
    }

    protected function registerCommands()
    {
        $this->commands([
            \SleepingOwl\Admin\Commands\InstallCommand::class,
            \SleepingOwl\Admin\Commands\UserManagerCommand::class,
            \SleepingOwl\Admin\Commands\SectionGenerate::class,
            \SleepingOwl\Admin\Commands\SectionMake::class,
        ]);
    }
}
