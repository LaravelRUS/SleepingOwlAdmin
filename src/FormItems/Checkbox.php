<?php

namespace SleepingOwl\Admin\FormItems;

use Request;

class Checkbox extends NamedFormItem
{
    public function save()
    {
        $name = $this->getName();
        if (! Request::has($name)) {
            Request::merge([$name => 0]);
        }

        parent::save();
    }
}
