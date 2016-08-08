<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Form\FormFactoryInterface;
use SleepingOwl\Admin\Form;

/**
 * @method Form\FormDefault form(array $elements = [])
 * @method Form\FormElements elements(array $elements = [])
 * @method Form\FormTabbed tabbed(array $elements = [])
 * @method Form\FormPanel panel(array $elements = [])
 */
class FormFactory extends AliasBinder implements FormFactoryInterface
{
}
