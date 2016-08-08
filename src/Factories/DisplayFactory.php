<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;
use SleepingOwl\Admin\Display\DisplayDatatables;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Display\DisplayTree;

/**
 * @method DisplayDatatables datatables()
 * @method DisplayDatatablesAsync datatablesAsync()
 * @method DisplayTab tab(Renderable $display)
 * @method DisplayTabbed tabbed(\Closure|array $tabs = null)
 * @method DisplayTable table()
 * @method DisplayTree tree()
 */
class DisplayFactory extends AliasBinder implements DisplayFactoryInterface
{
}
