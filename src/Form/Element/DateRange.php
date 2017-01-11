<?php

namespace SleepingOwl\Admin\Form\Element;

use Carbon\Carbon;

class DateRange extends Date
{
    /**
     * @var string
     */
    protected $format = 'Y-m-d';

    /**
     * @var string
     */
    protected $defaultFrom;

    /**
     * @var string
     */
    protected $defaultTo;

    /**
     * @var string
     */
    protected $view = 'form.element.daterange';

    /**
     * @return string
     */
    public function getDefaultFrom()
    {
        if (! $this->defaultFrom) {
            $this->defaultFrom = Carbon::now();
        }

        return $this->defaultFrom instanceof \DateTime
            ? $this->defaultFrom->format(config('sleeping_owl.dateFormat', $this->getPickerFormat()))
            : $this->defaultFrom;
    }

    /**
     * @param string $defaultFrom
     *
     * @return $this
     */
    public function setDefaultFrom($defaultFrom)
    {
        $this->defaultFrom = $defaultFrom;

        return $this;
    }

    /**
     * @return string
     */
    public function getDefaultTo()
    {
        if (! $this->defaultTo) {
            $this->defaultTo = Carbon::now();
        }

        return $this->defaultTo instanceof \DateTime
            ? $this->defaultTo->format(config('sleeping_owl.dateFormat', $this->getPickerFormat()))
            : $this->defaultTo;
    }

    /**
     * @param string $defaultTo
     *
     * @return $this
     */
    public function setDefaultTo($defaultTo)
    {
        $this->defaultTo = $defaultTo;

        return $this;
    }

    /**
     * @param mixed $value
     *
     * @return void
     */
    public function setModelAttribute($value)
    {
        $value = ! empty($value) ? array_map(function ($date) {
            return Carbon::createFromFormat($this->getPickerFormat(), $date);
        }, explode('::', $value)) : null;

        parent::setModelAttribute($value);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'startDate' => $this->getDefaultFrom(),
            'endDate' => $this->getDefaultTo(),
        ];
    }

    /**
     * @param string $value
     *
     * @return string|void
     */
    protected function parseValue($value)
    {
        dd($value);
    }
}
