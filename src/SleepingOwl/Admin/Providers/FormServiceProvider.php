<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Form\AdminForm;

class FormServiceProvider extends ServiceProvider
{

	public function register()
	{
		AdminForm::register('form', 'SleepingOwl\Admin\Form\FormDefault');
		AdminForm::register('related', 'SleepingOwl\Admin\Form\FormRelated');
	}

}