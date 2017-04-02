<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;
use SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface;

/**
 * @method static \SleepingOwl\Admin\Display\DisplayDatatables datatables()
 * @method static \SleepingOwl\Admin\Display\DisplayDatatablesAsync datatablesAsync()
 * @method static \SleepingOwl\Admin\Display\DisplayTab tab(\Illuminate\Contracts\Support\Renderable $display, string $label = null, string $icon = null, $badge = null)
 * @method static \SleepingOwl\Admin\Display\DisplayTabbed tabbed(\Closure|array $tabs = null)
 * @method static \SleepingOwl\Admin\Display\DisplayTable table()
 * @method static \SleepingOwl\Admin\Display\DisplayTree tree(TreeTypeInterface $type = null)
 * @method static \SleepingOwl\Admin\Navigation\Page page($class)
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
