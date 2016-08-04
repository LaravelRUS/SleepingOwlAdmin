<?php

namespace SleepingOwl\Admin\Form\Element;

class Images extends Image
{
    public function save()
    {
        $name = $this->getName();
        $value = $this->request->input($name, '');

        if (! empty($value)) {
            $value = explode(',', $value);
        } else {
            $value = [];
        }

        $this->request->merge([$name => $value]);
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
