<?php

namespace SleepingOwl\Admin\Traits;

use SleepingOwl\Admin\Structures\AssetPackage;

trait Assets
{
    /**
     * @var AssetPackage
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

        $this->package->js->push([$handle, $script, $dependency]);

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

        $this->package->css->push([$handle, $style, $attributes]);

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

        $this->package->with->push($packages);

        return $this;
    }

    /**
     * @return AssetPackage
     */
    public function loadPackage()
    {
        return $this->package;
    }
}
