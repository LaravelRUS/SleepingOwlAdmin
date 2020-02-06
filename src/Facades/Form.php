<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Form\FormDefault form(array $elements = [])
 * @method static \SleepingOwl\Admin\Form\FormElements elements(array $elements = [])
 * @method static \SleepingOwl\Admin\Form\FormTabbed tabbed(array $elements = [])
 * @method static \SleepingOwl\Admin\Form\FormCard card(array $elements = [])
 */
class Form extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.form';
    }
}
