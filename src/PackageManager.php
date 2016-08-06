<?php
namespace SleepingOwl\Admin;

use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\AssetsInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Structures\AssetPackage;

class PackageManager implements Initializable
{
    /**
     * @var AssetsInterface[]
     */
    protected $packages = [];

    /**
     * @var MetaInterface
     */
    protected $meta;

    /**
     * @var PackageManagerInterface
     */
    protected $packageManager;

    /**
     * PackageManager constructor.
     * @param PackageManagerInterface $packageManager
     * @param MetaInterface $meta
     */
    public function __construct(PackageManagerInterface $packageManager, MetaInterface $meta)
    {
        $this->packageManager = $packageManager;
        $this->meta = $meta;
    }

    /**
     * @param AssetsInterface $object
     * @return bool
     */
    protected function has(AssetsInterface $object)
    {
        return array_key_exists(get_class($object), $this->packages);
    }

    /**
     * @param AssetsInterface $object
     */
    public function add(AssetsInterface $object)
    {
        if ($this->has($object)) {
            return;
        }

        $this->packages[get_class($object)] = $object;
    }

    /**
     * @return mixed
     */
    public function initialize()
    {
        foreach ($this->packages as $packageObject) {
            /** @var AssetPackage $data */
            $data = call_user_func([$packageObject, 'loadPackage']);
            /** @var Package $package */
            $package = $this->packageManager->add($data->name);

            /** @var array $params */
            foreach ($data->js as $params) {
                call_user_func_array([$package, 'js'], $params);
            }

            foreach ($data->css as $params) {
                call_user_func_array([$package, 'css'], $params);
            }

            $with = $data->with->toArray();
            if (! empty($with)) {
                $package->with($with);
            }

            $this->meta->loadPackage($data->name);
        }
    }

}