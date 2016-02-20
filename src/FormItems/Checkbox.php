<?php

namespace SleepingOwl\Admin\FormItems;

use Input;

class Checkbox extends NamedFormItem
{
    public function save()
    {
        $name = $this->getName();
        if (! Input::has($name)) {
            Input::merge([$name => 0]);
        }

        parent::save();
    }
}
