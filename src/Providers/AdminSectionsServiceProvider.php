<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Contracts\Auth\Access\Gate;
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
     * @param \SleepingOwl\Admin\Admin $admin
     */
    public function boot(\SleepingOwl\Admin\Admin $admin)
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

    /**
     * @param string|null $namespace
     *
     * @return array
     */
    public function policies($namespace = null)
    {
        if (is_null($namespace)) {
            $namespace = config('sleeping_owl.policies_namespace', '\\App\\Policies\\');
        }
        $policies = [];
        foreach ($this->sections as $model => $section) {
            $policies[$section] = $namespace.class_basename($section).'SectionModelPolicy';
        }

        return $policies;
    }

    /**
     * @param string|null $namespace
     */
    public function registerPolicies($namespace = null)
    {
        foreach ($this->policies($namespace) as $section => $policy) {
            $this->app[Gate::class]->policy($section, $policy);
        }
    }
}
