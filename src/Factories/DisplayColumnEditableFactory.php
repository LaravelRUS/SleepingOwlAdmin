<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnEditableFactoryInterface;
use SleepingOwl\Admin\Display\Column\Editable\Boolean;
use SleepingOwl\Admin\Display\Column\Editable\Checkbox;
use SleepingOwl\Admin\Display\Column\Editable\Checklist;
use SleepingOwl\Admin\Display\Column\Editable\Date;
use SleepingOwl\Admin\Display\Column\Editable\DateTime;
use SleepingOwl\Admin\Display\Column\Editable\Number;
use SleepingOwl\Admin\Display\Column\Editable\Range;
use SleepingOwl\Admin\Display\Column\Editable\Select;
use SleepingOwl\Admin\Display\Column\Editable\Text;
use SleepingOwl\Admin\Display\Column\Editable\Textarea;

/**
 * @method Checklist checklist($name, $label = null, array|callable|Model|string $options = [], $small = null)
 * @method Select select($name, $label = null, array|callable|Model|string $options = [], $small = null)
 * @method Checkbox checkbox($name, $columnLabel = null, $small = null, $uncheckedLabel = null, $checkedLabel = null)
 */
class DisplayColumnEditableFactory extends AliasBinder implements DisplayColumnEditableFactoryInterface
{
    /**
     * DisplayColumnEditableFactory constructor.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $application
     */
    public function __construct(Application $application)
    {
        parent::__construct($application);

        $this->register([
            'boolean' => Boolean::class,
            'checkbox' => Checkbox::class,
            'checklist' => Checklist::class,
            'date' => Date::class,
            'datetime' => DateTime::class,
            'number' => Number::class,
            'range' => Range::class,
            'select' => Select::class,
            'text' => Text::class,
            'textarea' => Textarea::class,
        ]);
    }
}
