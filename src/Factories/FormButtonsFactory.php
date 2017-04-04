<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\Form;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Form\FormButtonsFactoryInterface;

/**
 * @method static Form\Buttons\Save save()
 * @method static Form\Buttons\SaveAndCreate saveAndCreate()
 * @method static Form\Buttons\SaveAndClose saveAndClose()
 * @method static Form\Buttons\Delete delete()
 * @method static Form\Buttons\Destroy destroy()
 * @method static Form\Buttons\Restore restore()
 * @method static Form\Buttons\Cancel cancel()
 */
class FormButtonsFactory extends AliasBinder implements FormButtonsFactoryInterface
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
            'save'          => Form\Buttons\Save::class,
            'saveAndClose'  => Form\Buttons\SaveAndClose::class,
            'saveAndCreate' => Form\Buttons\SaveAndCreate::class,
            'restore'       => Form\Buttons\Restore::class,
            'destroy'       => Form\Buttons\Destroy::class,
            'delete'        => Form\Buttons\Delete::class,
            'cancel'        => Form\Buttons\Cancel::class,
        ]);
    }
}
