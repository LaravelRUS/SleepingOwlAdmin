<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Display\AdminDisplay;

class DisplayServiceProvider extends ServiceProvider
{
    public function register()
    {
        AdminDisplay::register('datatables', \SleepingOwl\Admin\Display\DisplayDatatables::class);
        AdminDisplay::register('datatablesAsync', \SleepingOwl\Admin\Display\DisplayDatatablesAsync::class);
        AdminDisplay::register('tab', \SleepingOwl\Admin\Display\DisplayTab::class);
        AdminDisplay::register('tabbed', \SleepingOwl\Admin\Display\DisplayTabbed::class);
        AdminDisplay::register('table', \SleepingOwl\Admin\Display\DisplayTable::class);
        AdminDisplay::register('tree', \SleepingOwl\Admin\Display\DisplayTree::class);
    }
}
