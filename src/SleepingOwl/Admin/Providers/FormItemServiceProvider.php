<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\FormItems\FormItem;

class FormItemServiceProvider extends ServiceProvider
{

	public function register()
	{
		FormItem::register('columns', 'SleepingOwl\Admin\FormItems\Columns');
		FormItem::register('text', 'SleepingOwl\Admin\FormItems\Text');
		FormItem::register('select', 'SleepingOwl\Admin\FormItems\Select');
		FormItem::register('multiselect', 'SleepingOwl\Admin\FormItems\MultiSelect');
		FormItem::register('hidden', 'SleepingOwl\Admin\FormItems\Hidden');
		FormItem::register('checkbox', 'SleepingOwl\Admin\FormItems\Checkbox');
		FormItem::register('ckeditor', 'SleepingOwl\Admin\FormItems\CKEditor');
		FormItem::register('custom', 'SleepingOwl\Admin\FormItems\Custom');
	}

}