<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

class Assets extends Facade
{
    public static function getFacadeAccessor(): string
    {
        return 'assets';
    }
}
