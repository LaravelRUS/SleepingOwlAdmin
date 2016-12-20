<?php

namespace SleepingOwl\Admin\Traits;

use SleepingOwl\Admin\Contracts\Template\MetaInterface;

trait Assets
{
    /**
     * @var \KodiCMS\Assets\Package
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
     * @param MetaInterface $meta
     */
    protected function initializePackage(MetaInterface $meta)
    {
        $packageManager = $meta->assets()->packageManager();

        if (is_null($this->package = $packageManager->load(get_called_class()))) {
            $this->package = $packageManager->add(get_called_class());
        }
    }

    /**
     * @param MetaInterface $meta
     */
    protected function includePackage(MetaInterface $meta)
    {
        $meta->loadPackage(
            $this->package->getName()
        );
    }
}
