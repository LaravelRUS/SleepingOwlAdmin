<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Display\AdminDisplay;

class DisplayServiceProvider extends ServiceProvider
{

	public function register()
	{
		AdminDisplay::register('table', 'SleepingOwl\Admin\Display\DisplayTable');
		AdminDisplay::register('datatables', 'SleepingOwl\Admin\Display\DisplayDatatables');
		AdminDisplay::register('datatablesAsync', 'SleepingOwl\Admin\Display\DisplayDatatablesAsync');
		AdminDisplay::register('tree', 'SleepingOwl\Admin\Display\DisplayTree');
		AdminDisplay::register('tabbed', 'SleepingOwl\Admin\Display\DisplayTabbed');
		AdminDisplay::register('tab', 'SleepingOwl\Admin\Display\DisplayTab');
	}

}