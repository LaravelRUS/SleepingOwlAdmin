<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Form\FormFactoryInterface;
use SleepingOwl\Admin\Form;

/**
 * @method Form\FormDefault form(array $elements = [])
 * @method Form\FormElements elements(array $elements = [])
 * @method Form\FormTabbed tabbed(array $elements = [])
 * @method Form\FormCard card(array $elements = [])
 */
class FormFactory extends AliasBinder implements FormFactoryInterface
{
    /**
     * FormFactory constructor.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $application
     */
    public function __construct(Application $application)
    {
        parent::__construct($application);

        $this->register([
            'form' => Form\FormDefault::class,
            'elements' => Form\FormElements::class,
            'tabbed' => Form\FormTabbed::class,
            'panel' => Form\FormCard::class,
            'card' => Form\FormCard::class,
        ]);
    }
}
