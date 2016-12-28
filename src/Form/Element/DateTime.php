<?php

namespace SleepingOwl\Admin\Form\Element;

use Exception;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class DateTime extends NamedFormElement
{
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
    protected $pickerFormat;

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
    public function getValue()
    {
        $value = parent::getValue();
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
     * @param Model $model
     * @param string $attribute
     * @param mixed $value
     */
    public function setValue(Model $model, $attribute, $value)
    {
        $value = ! empty($value) ? Carbon::createFromFormat($this->getPickerFormat(), $value)->format($this->getFormat()) : null;

        parent::setValue($model, $attribute, $value);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $pickerFormat = $this->getPickerFormat();
        if (empty($pickerFormat)) {
            $pickerFormat = $this->getFormat();
        }

        return parent::toArray() + [
            'seconds'      => $this->hasSeconds(),
            'format'       => $this->getFormat(),
            'pickerFormat' => $this->generatePickerFormat(
                $pickerFormat
            ),
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
     * @param string $pickerFormat
     *
     * @return $this
     */
    public function setPickerFormat($pickerFormat)
    {
        $this->pickerFormat = $pickerFormat;

        return $this;
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
     * @param string $format
     *
     * @return string
     */
    protected function generatePickerFormat($format)
    {
        return strtr($format, [
            'i' => 'mm',
            's' => 'ss',
            'h' => 'hh',
            'H' => 'HH',
            'g' => 'h',
            'G' => 'H',
            'd' => 'DD',
            'j' => 'D',
            'm' => 'MM',
            'n' => 'M',
            'Y' => 'YYYY',
            'y' => 'YY',
        ]);
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

        return $time->format($this->getPickerFormat());
    }
}
