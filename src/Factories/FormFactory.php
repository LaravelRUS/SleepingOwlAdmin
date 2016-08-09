<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Form\FormFactoryInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Form;

/**
 * @method Form\FormDefault form(array $elements = [])
 * @method Form\FormElements elements(array $elements = [])
 * @method Form\FormTabbed tabbed(array $elements = [])
 * @method Form\FormPanel panel(array $elements = [])
 */
class FormFactory extends AliasBinder implements FormFactoryInterface
{

    /**
     * @param string $alias
     * @param array $arguments
     *
     * @return object
     */
    public function makeClass($alias, array $arguments)
    {
        array_unshift($arguments, app(FormButtonsInterface::class));
        array_unshift($arguments, app(TemplateInterface::class));

        $reflection = new \ReflectionClass($this->getAlias($alias));

        return $reflection->newInstanceArgs($arguments);
    }
}
