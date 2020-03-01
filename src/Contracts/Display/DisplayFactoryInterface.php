<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Display\DisplayTree;

/**
 * @method DisplayDatatablesAsync datatables()
 * @method DisplayDatatablesAsync datatablesAsync()
 * @method DisplayTab tab(Renderable $content, $label = null, $icon = null)
 * @method DisplayTabbed tabbed(\Closure|array $tabs = null)
 * @method DisplayTable table()
 * @method DisplayTree tree()
 */
interface DisplayFactoryInterface
{
}
