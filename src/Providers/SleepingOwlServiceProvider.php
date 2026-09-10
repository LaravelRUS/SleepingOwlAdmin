<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\View\Engines\EngineResolver;
use Illuminate\View\Engines\PhpEngine;
use Illuminate\View\Factory;
use Illuminate\View\FileViewFinder;
use SleepingOwl\Admin\Admin;

class SleepingOwlServiceProvider extends AdminSectionsServiceProvider
{
    public function register()
    {
        $this->replaceConfigRecursivelyFrom(__DIR__.'/../../config/sleeping_owl.php', 'sleeping_owl');
        $this->mergeConfigFrom(__DIR__.'/../../config/navigation.php', 'navigation');
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'sleeping_owl');
        $this->loadViewsFrom(
            [
                __DIR__.'/../../resources/views/themes/tabler',
                __DIR__.'/../../resources/views',
            ],
            'sleeping_owl_tabler'
        );

        $this->registerCore();
        $this->registerCommands();
    }

    /**
     * @param  Admin  $admin
     */
    public function boot(Admin $admin)
    {
        $admin->setTemplate($this->app['sleeping_owl.template']);
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../public' => public_path('packages/sleepingowl/'),
            ], 'assets');

            $this->publishes([
                __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
            ], 'config');
        }

        parent::boot($admin);
    }

    protected function registerCore()
    {
        $this->app->instance('sleeping_owl', new Admin($this->app));
    }

    /**
     * @return Factory
     */
    private function createLocalViewFactory()
    {
        $resolver = new EngineResolver();
        $resolver->register('php', function () {
            return new PhpEngine($this->app['files']);
        });
        $finder = new FileViewFinder($this->app['files'], $this->viewPaths());
        $factory = new Factory($resolver, $finder, $this->app['events']);
        $factory->addExtension('php', 'php');

        return $factory;
    }

    private function viewPaths(): array
    {
        return [
            __DIR__.'/../../resources/views',
        ];
    }

    protected function registerCommands()
    {
        if ($this->app->runningInConsole()) {
            if (class_exists('Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider') &&
                ! $this->app->resolved('Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider')) {
                $this->app->register('Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider');
            }

            $this->commands([
                \SleepingOwl\Admin\Console\Commands\InstallCommand::class,
                \SleepingOwl\Admin\Console\Commands\UpdateCommand::class,
                \SleepingOwl\Admin\Console\Commands\UserManagerCommand::class,
                \SleepingOwl\Admin\Console\Commands\SectionGenerate::class,
                \SleepingOwl\Admin\Console\Commands\SectionMake::class,
                \SleepingOwl\Admin\Console\Commands\SectionProvider::class,
                \SleepingOwl\Admin\Console\Commands\ExtensionMake::class,
            ]);

            $localViewFactory = $this->createLocalViewFactory();
            $this->app->singleton(
                'command.sleepingowl.ide.generate',
                function ($app) use ($localViewFactory) {
                    return new \SleepingOwl\Admin\Console\Commands\GeneratorCommand($app['config'], $app['files'], $localViewFactory);
                }
            );

            if (class_exists('Barryvdh\LaravelIdeHelper\Console\GeneratorCommand')) {
                $this->commands('command.sleepingowl.ide.generate');
            }
        }
    }
}
