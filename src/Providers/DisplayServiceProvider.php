<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Display;
use Illuminate\Support\ServiceProvider;

class DisplayServiceProvider extends ServiceProvider
{
    public function register()
    {
        Display::register('datatables', \SleepingOwl\Admin\Display\DisplayDatatables::class);
        Display::register('datatablesAsync', \SleepingOwl\Admin\Display\DisplayDatatablesAsync::class);
        Display::register('tab', \SleepingOwl\Admin\Display\DisplayTab::class);
        Display::register('tabbed', \SleepingOwl\Admin\Display\DisplayTabbed::class);
        Display::register('table', \SleepingOwl\Admin\Display\DisplayTable::class);
        Display::register('tree', \SleepingOwl\Admin\Display\DisplayTree::class);
    }
}
