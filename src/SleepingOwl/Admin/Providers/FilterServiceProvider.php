<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Filter\Filter;

class FilterServiceProvider extends ServiceProvider
{

	public function register()
	{
		Filter::register('field', 'SleepingOwl\Admin\Filter\FilterField');
		Filter::register('scope', 'SleepingOwl\Admin\Filter\FilterScope');
		Filter::register('custom', 'SleepingOwl\Admin\Filter\FilterCustom');
		Filter::register('related', 'SleepingOwl\Admin\Filter\FilterRelated');
	}

}