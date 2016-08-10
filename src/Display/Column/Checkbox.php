<?php

namespace SleepingOwl\Admin\Display\Column;

use Form;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
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
     * @param AdminInterface $admin
     * @param TableHeaderColumnInterface $headerColumn
     * @param string|null $label
     */
    public function __construct(AdminInterface $admin, TableHeaderColumnInterface $headerColumn, $label = null)
    {
        parent::__construct($admin, $headerColumn, $label);
        $this->setLabel(
            Form::checkbox(null, 1, false, ['class' => 'adminCheckboxAll']
        ));

        $this->setOrderable(false);
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
