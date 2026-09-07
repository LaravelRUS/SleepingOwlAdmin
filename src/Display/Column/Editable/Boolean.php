<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

class Boolean extends Checkbox
{
    protected $view = 'column.editable.boolean';

    public function getCheckedLabel()
    {
        return $this->checkedLabel ?? "<i class='fas fa-check'></i>";
    }

    public function getUncheckedLabel()
    {
        return $this->uncheckedLabel ?? "<i class='fas fa-minus'></i>";
    }
}
