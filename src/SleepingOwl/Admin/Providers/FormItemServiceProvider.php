<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\FormItems\FormItem;

class FormItemServiceProvider extends ServiceProvider
{

	public function register()
	{
		FormItem::register('text', 'SleepingOwl\Admin\FormItems\Text');
		FormItem::register('hidden', 'SleepingOwl\Admin\FormItems\Hidden');
		FormItem::register('columns', 'SleepingOwl\Admin\FormItems\Columns');
	}

}