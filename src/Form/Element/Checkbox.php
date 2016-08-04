<?php

namespace SleepingOwl\Admin\Form\Element;

class Checkbox extends NamedFormElement
{
    public function save()
    {
        $name = $this->getName();
        if (! $this->request->has($name)) {
            $this->request->merge([$name => 0]);
        }

        parent::save();
    }
}
