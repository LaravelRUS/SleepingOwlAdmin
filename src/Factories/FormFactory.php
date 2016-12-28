<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\Form;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Form\FormFactoryInterface;

/**
 * @method Form\FormDefault form(array $elements = [])
 * @method Form\FormElements elements(array $elements = [])
 * @method Form\FormTabbed tabbed(array $elements = [])
 * @method Form\FormPanel panel(array $elements = [])
 */
class FormFactory extends AliasBinder implements FormFactoryInterface
{
    /**
     * FormFactory constructor.
     *
     * @param \Illuminate\Contracts\Foundation\Application $application
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $application)
    {
        parent::__construct($application);

        $this->register([
            'form' => Form\FormDefault::class,
            'elements' => Form\FormElements::class,
            'tabbed' => Form\FormTabbed::class,
            'panel' => Form\FormPanel::class,
        ]);
    }
}
