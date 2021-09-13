<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Date extends DateTime implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $format = 'Y-m-d';

    /**
     * @var string
     */
    protected $view = 'column.editable.date';

    /**
     * Text constructor.
     *
     * @param  $name
     * @param  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);

        $this->setFormat(config('sleeping_owl.dateFormat'));
        $this->setCombodateValue(['maxYear' => now()->addYears(100)->format('Y')]);
    }

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.dateFormat');
    }
}
