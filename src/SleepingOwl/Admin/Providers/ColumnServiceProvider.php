<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Columns\Column;

class ColumnServiceProvider extends ServiceProvider
{

	public function register()
	{
		Column::register('action', 'SleepingOwl\Admin\Columns\Column\Action');
		Column::register('checkbox', 'SleepingOwl\Admin\Columns\Column\Checkbox');
		Column::register('control', 'SleepingOwl\Admin\Columns\Column\Control');
		Column::register('count', 'SleepingOwl\Admin\Columns\Column\Count');
		Column::register('custom', 'SleepingOwl\Admin\Columns\Column\Custom');
		Column::register('datetime', 'SleepingOwl\Admin\Columns\Column\DateTime');
		Column::register('filter', 'SleepingOwl\Admin\Columns\Column\Filter');
		Column::register('image', 'SleepingOwl\Admin\Columns\Column\Image');
		Column::register('lists', 'SleepingOwl\Admin\Columns\Column\Lists');
		Column::register('order', 'SleepingOwl\Admin\Columns\Column\Order');
		Column::register('string', 'SleepingOwl\Admin\Columns\Column\String');
		Column::register('treeControl', 'SleepingOwl\Admin\Columns\Column\TreeControl');
		Column::register('url', 'SleepingOwl\Admin\Columns\Column\Url');
	}

}