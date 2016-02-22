<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;

class Checkbox extends NamedFormElement
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
