<?php

namespace SleepingOwl\Admin\Display\Column;

use Carbon\Carbon;

class DateTime extends NamedColumn
{
    /**
     * Datetime format.
     * @var string
     */
    protected $format;

    public function __construct($name)
    {
        parent::__construct($name);
        $this->setAttribute('class', 'row-control');
    }

    /**
     * @return string
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * @param string $format
     *
     * @return $this
     */
    public function setFormat($format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function toArray()
    {
        $value = $this->getModelValue();
        $originalValue = $value;

        if (! is_null($value)) {
            if (! $value instanceof Carbon) {
                $value = Carbon::parse($value);
            }

            $value = $value->format($this->getFormat());
        }

        $this->setAttribute('data-order', $originalValue);

        return parent::toArray() + [
            'value'         => $value,
            'originalValue' => $originalValue,
            'append'        => $this->getAppends(),
        ];
    }
}
