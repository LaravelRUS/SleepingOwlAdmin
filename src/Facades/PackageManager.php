<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

class PackageManager extends Facade
{
    public static function getFacadeAccessor(): string
    {
        return 'assets.packages';
    }
}
