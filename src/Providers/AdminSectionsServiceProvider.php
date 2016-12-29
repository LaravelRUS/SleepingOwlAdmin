<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;

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
     * @param \SleepingOwl\Admin\Contracts\AdminInterface $admin
     */
    public function boot(\SleepingOwl\Admin\Contracts\AdminInterface $admin)
    {
        foreach ($this->sections as $model => $section) {
            if (class_exists($section)) {
                $admin->register(new $section($model));
            }
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
