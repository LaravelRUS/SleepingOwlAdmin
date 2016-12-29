<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Exceptions\TemplateException;

class SleepingOwlServiceProvider extends AdminSectionsServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../../config/sleeping_owl.php', 'sleeping_owl');
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'sleeping_owl');

        $this->registerTemplate();
        $this->registerCore();
        $this->registerCommands();
    }

    /**
     * @param \SleepingOwl\Admin\Contracts\AdminInterface $admin
     */
    public function boot(\SleepingOwl\Admin\Contracts\AdminInterface $admin)
    {
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../public' => public_path('packages/sleepingowl/'),
            ], 'assets');

            $this->publishes([
                __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
            ], 'config');
        }

        if (file_exists($assetsFile = __DIR__.'/../../resources/assets.php')) {
            include $assetsFile;
        }

        parent::boot($admin);
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

    protected function registerCore()
    {
        $this->app->instance('sleeping_owl', $admin = new Admin($this->app));
        $admin->setTemplate($this->app['sleeping_owl.template']);
    }

    protected function registerTemplate()
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

        $this->app->singleton('sleeping_owl.template', function ($app) {
            if (! class_exists($class = $this->getConfig('template'))) {
                throw new TemplateException("Template class [{$class}] not found");
            }

            return $app->make($class);
        });
    }

    protected function registerCommands()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                \SleepingOwl\Admin\Console\Commands\InstallCommand::class,
                \SleepingOwl\Admin\Console\Commands\UpdateCommand::class,
                \SleepingOwl\Admin\Console\Commands\UserManagerCommand::class,
                \SleepingOwl\Admin\Console\Commands\SectionGenerate::class,
                \SleepingOwl\Admin\Console\Commands\SectionMake::class,
                \SleepingOwl\Admin\Console\Commands\SectionProvider::class,
            ]);
        }
    }
}
