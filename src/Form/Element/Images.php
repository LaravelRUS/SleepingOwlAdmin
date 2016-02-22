<?php

namespace SleepingOwl\Admin\Form\Element;

use Meta;
use Request;

class Images extends Image
{
    public function initialize()
    {
        Meta::loadPackage(get_class());
    }

    public function save()
    {
        $name = $this->getName();
        $value = Request::get($name, '');

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
    public function value()
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
