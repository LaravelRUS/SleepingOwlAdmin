<?php

namespace SleepingOwl\Admin\Column;

use Form;

class Checkbox extends BaseColumn
{
    /**
     * @var string
     */
    protected $view = 'column.checkbox';

    public function __construct()
    {
        parent::__construct();
        $this->setLabel(
            Form::checkbox(null, 1, ['class' => 'adminCheckboxAll']
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
