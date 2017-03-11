<?php

namespace SleepingOwl\Admin\Form\Element;

class Date extends DateTime
{
    /**
     * @var string
     */
    protected $format = 'Y-m-d';

    /**
     * @var string
     */
    protected $view = 'form.element.date';

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.dateFormat');
    }
}
