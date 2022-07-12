<?php

namespace SleepingOwl\Admin\Traits;

use KodiCMS\Assets\Exceptions\PackageException;
use KodiCMS\Assets\Facades\PackageManager;
use KodiCMS\Assets\Package;

trait Assets
{
    /**
     * @var Package
     */
    protected $package;

    /**
     * @param string|null $handle
     * @param string $script
     * @param array $dependency
     * @return $this
     */
    public function addScript(?string $handle, string $script, array $dependency = []): Assets
    {
        if (is_null($handle)) {
            $handle = $script;
        }

        $this->package->js($handle, $script, $dependency, true);

        return $this;
    }

    /**
     * @param string|null $handle
     * @param string $style
     * @param array $attributes
     * @return $this
     */
    public function addStyle(?string $handle, string $style, array $attributes = []): Assets
    {
        if (is_null($handle)) {
            $handle = $style;
        }

        $this->package->css($handle, $style, $attributes);

        return $this;
    }

    /**
     * @param string ... $package
     * @return $this
     */
    public function withPackage($packages): Assets
    {
        $packages = is_array($packages)
            ? $packages
            : func_get_args();

        $this->package->with($packages);

        return $this;
    }

    protected function initializePackage()
    {
        if (is_null($this->package = PackageManager::load(get_called_class()))) {
            $this->package = PackageManager::add(get_called_class());
        }
    }

    /**
     * @throws PackageException
     */
    protected function includePackage()
    {
        app('sleeping_owl.meta')->loadPackage($this->package->getName());
    }
}
