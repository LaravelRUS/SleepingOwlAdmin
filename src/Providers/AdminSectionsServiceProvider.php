<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Model\ModelConfigurationFactory;

class AdminSectionsServiceProvider extends ServiceProvider
{
    /**
     * @var array  Associative array in form of: Model::class => Section::class
     */
    protected $sections = [];

    /**
     * Register the service provider.
     *
     * @param AdminInterface $admin
     */
    public function boot(AdminInterface $admin)
    {
        /** @var ModelConfigurationFactory $factory */
        $factory = $this->app->make(ModelConfigurationFactory::class);

        foreach ($this->sections as $model => $section) {
            if (class_exists($section)) {
                $admin->register($factory->make($section, $model));
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
