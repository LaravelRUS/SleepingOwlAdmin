<?php

namespace SleepingOwl\Tests;

use SleepingOwl\Admin\Assets\AssetPackage;
use SleepingOwl\Admin\Facades\PackageManager;

trait AssetsTesterTrait
{
    public function packageIncluded()
    {
        PackageManager::shouldReceive('load')->once()->andReturnNull();
        PackageManager::shouldReceive('add')->once()->andReturn(
            AssetPackage::create('test-package')
        );
    }

    public function packageInitialized()
    {
        //\SleepingOwl\Admin\Facades\Meta::shouldReceive('loadPackage')->once();
    }
}
