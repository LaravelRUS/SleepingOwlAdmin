<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Form;
use Illuminate\Support\ServiceProvider;

class FormServiceProvider extends ServiceProvider
{
    public function register()
    {
        Form::register('form', \SleepingOwl\Admin\Form\FormDefault::class);
        Form::register('tabbed', \SleepingOwl\Admin\Form\FormTabbed::class);
        Form::register('panel', \SleepingOwl\Admin\Form\FormPanel::class);
    }
}
