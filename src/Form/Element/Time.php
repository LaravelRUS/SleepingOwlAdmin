<?php

namespace SleepingOwl\Admin\Form\Element;

class Time extends DateTime
{
    /**
     * @var string|null
     */
    protected ?string $format = 'H:i:s';

    /**
     * @var string
     */
    protected string $view = 'form.element.time';

    /**
     * @return string
     */
    public function getPickerFormat(): string
    {
        return $this->pickerFormat ?: config('sleeping_owl.timeFormat');
    }
}
