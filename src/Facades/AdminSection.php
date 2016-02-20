<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

class AdminSection extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl';
    }
}
