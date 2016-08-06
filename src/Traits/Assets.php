<?php

namespace SleepingOwl\Admin\Traits;

use KodiCMS\Assets\Package;

trait Assets
{
    /**
     * @var Package
     */
    protected $package;

    /**
     * @param string $handle
     * @param string $script
     * @param array $dependency
     *
     * @return $this
     */
    public function addScript($handle, $script, array $dependency = [])
    {
        if (is_null($handle)) {
            $handle = $script;
        }

        $this->package->js($handle, $script, $dependency);

        return $this;
    }

    /**
     * @param string $handle
     * @param string $style
     * @param array $attributes
     *
     * @return $this
     */
    public function addStyle($handle, $style, array $attributes = [])
    {
        if (is_null($handle)) {
            $handle = $style;
        }

        $this->package->css($handle, $style, $attributes);

        return $this;
    }

    /**
     * @param string ... $package
     *
     * @return $this
     */
    public function withPackage($packages)
    {
        $packages = is_array($packages)
            ? $packages
            : func_get_args();

        $this->package->with($packages);

        return $this;
    }

    /**
     * @return Package
     */
    public function loadPackage()
    {
        return $this->package;
    }
}
