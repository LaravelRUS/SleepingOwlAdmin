<?php

namespace SleepingOwl\Admin\Form\Element;

use Exception;
use Carbon\Carbon;

class DateTime extends NamedFormElement
{
    use \SleepingOwl\Admin\Traits\DatePicker;

    /**
     * @var string
     */
    protected $format = 'Y-m-d H:i:s';

    /**
     * @var bool
     */
    protected $seconds = false;

    /**
     * @var string
     */
    protected $view = 'form.element.datetime';

    /**
     * @return string
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * @param string|null $format
     *
     * @return $this
     */
    public function setFormat($format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * @return $this|NamedFormElement|mixed|null|string
     */
    public function getValueFromModel()
    {
        $value = parent::getValueFromModel();
        if (! empty($value)) {
            return $this->parseValue($value);
        }
    }

    /**
     * @return bool
     */
    public function hasSeconds()
    {
        return (bool) $this->seconds;
    }

    /**
     * @param bool $seconds
     *
     * @return $this
     */
    public function setSeconds($seconds)
    {
        $this->seconds = $seconds;

        return $this;
    }

    /**
     * @param mixed $value
     *
     * @return void
     */
    public function setModelAttribute($value)
    {
        $value = ! empty($value)
            ? Carbon::createFromFormat($this->getPickerFormat(), $value)->format($this->getFormat())
            : null;

        parent::setModelAttribute($value);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'seconds'      => $this->hasSeconds(),
            'format'       => $this->getFormat(),
            'pickerFormat' => $this->getJsPickerFormat(),
        ];
    }

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.datetimeFormat');
    }

    /**
     * @return $this
     *
     * SMELLS This function does more than it says.
     */
    public function setCurrentDate()
    {
        $this->defaultValue = Carbon::now()->format($this->getFormat());

        return $this;
    }

    /**
     * @param string $value
     *
     * @return string|void
     */
    protected function parseValue($value)
    {
        try {
            $time = Carbon::parse($value);
        } catch (Exception $e) {
            try {
                $time = Carbon::createFromFormat($this->getPickerFormat(), $value);
            } catch (Exception $e) {
                return;
            }
        }

        return $time->format(
            $this->getPickerFormat()
        );
    }
}
