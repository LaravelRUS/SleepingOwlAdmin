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

    public function __construct()
    {
        parent::__construct();
        $this->setLabel(
            Form::checkbox(null, 1, false, ['class' => 'adminCheckboxAll']
        ));

        $this->setOrderable(false);
        $this->setAttribute('class', 'row-checkbox');
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
