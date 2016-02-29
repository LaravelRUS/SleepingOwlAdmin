<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\DisplayDatatables datatables()
 * @method static \SleepingOwl\Admin\Display\DisplayDatatablesAsync datatablesAsync()
 * @method static \SleepingOwl\Admin\Display\DisplayTab tab($display)
 * @method static \SleepingOwl\Admin\Display\DisplayTabbed tabbed()
 * @method static \SleepingOwl\Admin\Display\DisplayTable table()
 * @method static \SleepingOwl\Admin\Display\DisplayTree tree()
 */
class Display extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'sleeping_owl.display';
    }
}
