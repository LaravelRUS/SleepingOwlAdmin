<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Contracts\AdminInterface;

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
     * @param AdminInterface $admin
     */
    public function boot(AdminInterface $admin)
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
            \DaveJamesMiller\Breadcrumbs\ServiceProvider::class,
            \KodiCMS\Assets\AssetsServiceProvider::class,
            \Collective\Html\HtmlServiceProvider::class,
            AdminServiceProvider::class,
            AliasesServiceProvider::class,
        ];

        foreach ($providers as $providerClass) {
            $this->app->register($providerClass);
        }

        /* Workaround to allow use ServiceProvider-based configurations in old fashion */
        $defaultAdminSectionsServiceProviderClass = $this->app->getNamespace().'Providers\AdminSectionsServiceProvider';
        if (class_exists($defaultAdminSectionsServiceProviderClass)) {
            $this->app->register($defaultAdminSectionsServiceProviderClass);
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
