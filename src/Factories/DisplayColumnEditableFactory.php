<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnEditableFactoryInterface;
use SleepingOwl\Admin\Display\Column\Editable\Checkbox;
use SleepingOwl\Admin\Display\Column\Editable\DateTime;
use SleepingOwl\Admin\Display\Column\Editable\Select;
use SleepingOwl\Admin\Display\Column\Editable\Text;
use SleepingOwl\Admin\Display\Column\Editable\Textarea;

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
    public function __construct(Application $application)
    {
        parent::__construct($application);

        $this->register([
            'checkbox' => Checkbox::class,
            'text' => Text::class,
            'textarea' => Textarea::class,
            'select' => Select::class,
            'datetime' => DateTime::class,
        ]);
    }
}
