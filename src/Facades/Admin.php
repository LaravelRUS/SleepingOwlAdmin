<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \SleepingOwl\Admin\Admin
 * @method static \SleepingOwl\Admin\Section getModel(string|object $class)
 */
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
