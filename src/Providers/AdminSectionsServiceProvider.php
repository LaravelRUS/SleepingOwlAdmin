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
     * @param string|null $namespace
     *
     * @return array
     */
    public function policies($namespace = null)
    {
        if (is_null($namespace)) {
            $namespace = config('sleepingowl.policies_namespace', '\\App\\Policies\\');
        }

        $policies = [];

        foreach ($this->sections as $section => $model) {
            $policies[$section] = $namespace.class_basename($section).'SectionModelPolicy';
        }

        return $policies;
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

    /**
     * @param string|null $namespace
     */
    public function registerPolicies($namespace = null)
    {
        foreach ($this->policies($namespace) as $section => $policy) {
            Gate::policy($section, $policy);
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
