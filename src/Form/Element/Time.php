<?php

namespace SleepingOwl\Admin\Form\Element;

class Time extends DateTime
{
    /**
     * @var string
     */
    protected $format = 'H:i:s';

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.timeFormat');
    }
}
