<?php
namespace SleepingOwl\Admin\Contracts;

use SleepingOwl\Admin\Structures\AssetPackage;

interface AssetsInterface
{
    /**
     * @return AssetPackage
     */
    public function loadPackage();
}