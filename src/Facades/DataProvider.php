<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

class DataProvider extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.data_provider';
    }
}
