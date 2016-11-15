<?php

namespace SleepingOwl\Admin\Form\Element;

class Date extends DateTime
{
    /**
     * @var string
     */
    protected $format = 'Y-m-d';

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.dateFormat');
    }
}
