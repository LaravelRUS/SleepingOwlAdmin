<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Form\AdminForm;
use Illuminate\Support\ServiceProvider;

class FormServiceProvider extends ServiceProvider
{
    public function register()
    {
        AdminForm::register('form', \SleepingOwl\Admin\Form\FormDefault::class);
        AdminForm::register('tabbed', \SleepingOwl\Admin\Form\FormTabbed::class);
        AdminForm::register('panel', \SleepingOwl\Admin\Form\FormPanel::class);
    }
}
