<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Templates\Breadcrumbs;

class BreadcrumbsServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('sleeping_owl.breadcrumbs', function () {
            return $this->app->make(Breadcrumbs::class);
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [
            'sleeping_owl.breadcrumbs',
            'SleepingOwl\Admin\Contracts\Template\BreadcrumbsInterface',
        ];
    }
}
