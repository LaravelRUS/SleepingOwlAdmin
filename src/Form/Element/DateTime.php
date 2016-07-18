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
        if (empty($value)) {
            $value = null;
        }

        if (! is_null($value)) {
            try {
                $time = Carbon::parse($value);
            } catch (Exception $e) {
                try {
                    $time = Carbon::createFromFormat($this->getFormat(), $value);
                } catch (Exception $e) {
                    return;
                }
            }

            $value = $time->format($this->getFormat());
        }

        return $value;
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
     */
    public function setSeconds($seconds)
    {
        $this->seconds = $seconds;
    }

    /**
     * @param Model $model
     * @param string $attribute
     * @param mixed $value
     */
    public function setValue(Model $model, $attribute, $value)
    {
        if (! is_null($value)) {
            $value = Carbon::createFromFormat($this->getFormat(), $value);
        }

        parent::setValue($model, $attribute, $value);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'seconds'      => $this->hasSeconds(),
            'format'       => $this->getFormat(),
            'pickerFormat' => $this->getPickerFormat(),
        ];
    }

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        if (is_null($this->pickerFormat)) {
            return $this->generatePickerFormat();
        }

        return $this->pickerFormat;
    }

    /**
     * @param string $pickerFormat
     */
    public function setPickerFormat($pickerFormat)
    {
        $this->pickerFormat = $pickerFormat;
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
     * @return string
     */
    protected function generatePickerFormat()
    {
        $format = $this->getFormat();
        $replacement = [
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
        ];

        return strtr($format, $replacement);
    }
}
