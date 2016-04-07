<?php

namespace SleepingOwl\Admin\Display\Column;

use Form;
use SleepingOwl\Admin\Display\TableColumn;

class Checkbox extends TableColumn
{
    /**
     * @var string
     */
    protected $view = 'column.checkbox';

    /**
     * Checkbox constructor.
     *
     * @param string|null $label
     */
    public function __construct($label = null)
    {
        parent::__construct($label);
        $this->setLabel(
            Form::checkbox(null, 1, false, ['class' => 'adminCheckboxAll']
        ));

        $this->setOrderable(false);
        $this->setHtmlAttribute('class', 'row-checkbox');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModel()->getKey(),
        ];
    }
}
