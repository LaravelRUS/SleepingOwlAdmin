<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * Class Navigation.
 *
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
