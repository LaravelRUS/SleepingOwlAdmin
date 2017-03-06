<?php

namespace SleepingOwl\Tests;

trait AssetsTesterTrait
{
    public function packageIncluded()
    {
        \KodiCMS\Assets\Facades\PackageManager::shouldReceive('load')->once();
        \KodiCMS\Assets\Facades\PackageManager::shouldReceive('add')->once();
    }

    public function packageInitialized()
    {
        //\KodiCMS\Assets\Facades\Meta::shouldReceive('loadPackage')->once();
    }
}
