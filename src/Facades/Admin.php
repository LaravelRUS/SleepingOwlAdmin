<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

class Admin extends Facade
{
    /**
     * @return string
     */
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl';
    }
}
