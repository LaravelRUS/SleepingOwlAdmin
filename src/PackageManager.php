<?php

namespace SleepingOwl\Admin;

use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\Initializable;

class PackageManager implements Initializable
{
    /**
     * @var Package[]
     */
    protected $packages = [];

    /**
     * @var MetaInterface
     */
    protected $meta;

    /**
     * PackageManager constructor.
     *
     * @param MetaInterface $meta
     */
    public function __construct(MetaInterface $meta)
    {
        $this->meta = $meta;
    }

    /**
     * @param Package $package
     * @return bool
     */
    public function has(Package $package)
    {
        return array_key_exists($package->getName(), $this->packages);
    }

    /**
     * @param Package $package
     */
    public function add(Package $package)
    {
        if ($this->has($package)) {
            return;
        }

        $this->packages[$package->getName()] = $package;
    }

    /**
     * @return mixed
     */
    public function initialize()
    {
        foreach ($this->packages as $package) {
            $this->meta->loadPackage($package->getName());
        }
    }
}
