<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Container\Container;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use KodiCMS\Assets\Package;

class PackageFactory
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * PackageFactory constructor.
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @param string $forClass
     * @return Package
     */
    public function make($forClass)
    {
        $alias = 'sleeping_owl.package.'.$forClass;
        if ($this->container->resolved($alias)) {
            return $this->container->make($alias);
        }

        /** @var PackageManagerInterface $assetsPackageManager */
        $assetsPackageManager = $this->container->make(PackageManagerInterface::class);
        /** @var Package $package */
        $package = $assetsPackageManager->add($forClass);

        $this->container->singleton($alias, function () use ($package) {
            return $package;
        });

        return $package;
    }
}
