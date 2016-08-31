<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Contracts\AdminInterface;

class AdminSectionsServiceProvider extends ServiceProvider
{
    /**
     * @var array  Associative array in form of: Model::class => Section::class
     */
    protected $sections = [];

    /**
     * @return array
     */
    public function sections()
    {
        return $this->sections;
    }

    /**
     * Register the service provider.
     *
     * @param AdminInterface $admin
     */
    public function boot(AdminInterface $admin)
    {
        foreach ($this->sections as $section => $model) {
            if (class_exists($section)) {
                $admin->register($this->app->make($section, ['class' => $model]));
            }
        }
    }

    public function registerPolicies()
    {
        foreach ($this->sections as $section => $model) {
            Gate::policy($section, class_basename($section).'SectionModelPolicy');
        }
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        // TODO: Implement register() method.
    }
}
