<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Form\FormDefault form()
 * @method static \SleepingOwl\Admin\Form\FormTabbed tabbed()
 * @method static \SleepingOwl\Admin\Form\FormPanel panel()
 */
class Form extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.form';
    }
}
