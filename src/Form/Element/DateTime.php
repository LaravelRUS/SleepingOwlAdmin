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
     * @var string
     */
    protected $timezone;

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
     * @return string
     */
    public function getTimezone()
    {
        if (is_null($this->timezone)) {
            $this->timezone = config('sleeping_owl.timezone');
        }

        return $this->timezone;
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
     * @param string $timezone
     *
     * @return $this
     */
    public function setTimezone($timezone)
    {
        $this->timezone = $timezone;

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
            ? Carbon::createFromFormat($this->getPickerFormat(), $value, $this->getTimezone())
                    ->timezone(config('app.timezone'))->format($this->getFormat())
            : null;

        parent::setModelAttribute($value);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'data-date-format'     => $this->getJsPickerFormat(),
            'data-date-pickdate'   => 'true',
            'data-date-picktime'   => 'false',
            'data-date-useseconds' => $this->hasSeconds() ? 'true' : 'false',
            'class'                => 'form-control',
            'type'                 => 'text',
        ]);

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
        $this->defaultValue = Carbon::now()->timezone($this->getTimezone())->format($this->getFormat());

        return $this;
    }

    /**
     * @param $value mixed
     * @return string|void
     */
    protected function parseValue($value)
    {
        try {
            $time = Carbon::parse($value);
        } catch (Exception $e) {
            \Log::info('unable to parse date, re-trying with given format', [
                'exception' => $e,
                'date'      => $value,
            ]);
            try {
                $time = Carbon::createFromFormat($this->getPickerFormat(), $value);
            } catch (Exception $e) {
                \Log::error('unable to parse date!', [
                    'exception'     => $e,
                    'pickerFormat'  => $this->getPickerFormat(),
                    'date'          => $value,
                ]);

                return;
            }
        }

        return $time->timezone($this->getTimezone())->format(
            $this->getPickerFormat()
        );
    }
}
