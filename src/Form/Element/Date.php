<?php

namespace SleepingOwl\Admin\Form\Element;

class Date extends DateTime
{
    /**
     * @var string|null
     */
    protected ?string $format = 'Y-m-d';

    /**
     * @var string
     */
    protected string $view = 'form.element.date';

    /**
     * @return string
     */
    public function getPickerFormat(): string
    {
        return $this->pickerFormat ?: config('sleeping_owl.dateFormat');
    }
}
