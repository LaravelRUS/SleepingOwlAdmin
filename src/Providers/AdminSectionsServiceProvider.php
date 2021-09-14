<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Admin;

class AdminSectionsServiceProvider extends ServiceProvider
{
    /**
     * @var array Associative array in form of: Model::class => Section::class
     */
    protected $sections = [];

    /**
     * @var array Associative array in form of: Section::class => Policy::class
     */
    protected $policies = [];

    /**
     * @return array
     */
    public function sections()
    {
        return $this->sections;
    }

    /**
     * @param  Admin  $admin
     */
    public function boot(Admin $admin)
    {
        $admin->registerSections($this->sections());
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * @param  string|null  $namespace
     * @return array
     */
    public function policies($namespace = null)
    {
        if (is_null($namespace)) {
            $namespace = config('sleeping_owl.policies_namespace', '\\App\\Policies\\');
        }

        $policies = [];
        $preparedPolicies = collect($this->policies);

        foreach ($this->sections as $model => $section) {
            if ($preparedPolicies->has($section)) {
                $policies[$section] = $preparedPolicies->get($section);
                continue;
            }

            $policies[$section] = $namespace.class_basename($section).'SectionModelPolicy';
        }

        return $policies;
    }

    /**
     * @param  string|null  $namespace
     */
    public function registerPolicies($namespace = null)
    {
        foreach ($this->policies($namespace) as $section => $policy) {
            $this->app[Gate::class]->policy($section, $policy);
        }
    }
}
