<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\ColumnFilters\ColumnFilter;

class ColumnFilterServiceProvider extends ServiceProvider
{

	public function register()
	{
		ColumnFilter::register('text', 'SleepingOwl\Admin\ColumnFilters\Text');
	}

}