<?php

namespace SleepingOwl\Admin\Form\Element;

class Checkbox extends NamedFormElement
{
    /**
     * @var string
     */
    protected $view = 'form.element.checkbox';

    /**
     * @param  mixed  $value
     * @return mixed
     */
    public function prepareValue($value)
    {
        return parent::prepareValue((bool) $value);
    }
}
