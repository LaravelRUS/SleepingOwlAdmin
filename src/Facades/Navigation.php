<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Collection;

/**
 * Class Navigation
 * @package SleepingOwl\Admin\Facades
 * @method static \SleepingOwl\Admin\Navigation setFromArray(array $navigation)
 */
class Navigation extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'sleeping_owl.navigation';
    }
}
