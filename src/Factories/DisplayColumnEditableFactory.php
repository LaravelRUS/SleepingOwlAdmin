<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnEditableFactoryInterface;
use SleepingOwl\Admin\Display\Column\Editable\Checkbox;

/**
 * @method Checkbox checkbox($name)
 */
class DisplayColumnEditableFactory extends AliasBinder implements DisplayColumnEditableFactoryInterface
{

    /**
     * DisplayColumnEditableFactory constructor.
     *
     * @param \Illuminate\Contracts\Foundation\Application $application
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $application)
    {
        parent::__construct($application);

        $this->register([
            'checkbox' => Checkbox::class,
        ]);
    }
}
