<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Assets\AssetPackage add(string|\SleepingOwl\Admin\Assets\AssetPackage $package)
 * @method static \SleepingOwl\Admin\Assets\AssetPackage|null load(string $name)
 * @method static list<\SleepingOwl\Admin\Assets\AssetPackage> resolve(string|array $names)
 */
class PackageManager extends Facade
{
    public static function getFacadeAccessor(): string
    {
        return 'assets.packages';
    }
}
