<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;

class Images extends Image
{
    public function save()
    {
        $name = $this->getName();
        $value = Request::input($name, '');

        if (! empty($value)) {
            $value = explode(',', $value);
        } else {
            $value = [];
        }

        Request::merge([$name => $value]);
        parent::save();
    }

    /**
     * @return string
     */
    public function getValue()
    {
        $value = parent::getValue();
        if (is_null($value)) {
            $value = [];
        }

        if (is_string($value)) {
            $value = preg_split('/,/', $value, -1, PREG_SPLIT_NO_EMPTY);
        }

        return $value;
    }
}
