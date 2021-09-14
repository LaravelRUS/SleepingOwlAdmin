<?php

namespace SleepingOwl\Admin\Form\Element;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Traits\DateFormat;
use SleepingOwl\Admin\Traits\DatePicker;

class DateTime extends NamedFormElement
{
    use DatePicker, DateFormat;

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
     * @param  bool  $seconds
     * @return $this
     */
    public function setSeconds($seconds)
    {
        $this->seconds = $seconds;

        return $this;
    }

    /**
     * @param  mixed  $value
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
            'data-date-format' => $this->getJsPickerFormat(),
            'data-date-pickdate' => 'true',
            'data-date-picktime' => 'false',
            'data-date-useseconds' => $this->hasSeconds() ? 'true' : 'false',
            'class' => 'form-control',
            'type' => 'text',
        ]);

        return parent::toArray() + [
            'seconds' => $this->hasSeconds(),
            'format' => $this->getFormat(),
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
    public function parseValue($date)
    {
        if (empty($date)) {
            return;
        }
        if (! $date instanceof Carbon) {
            try {
                $date = Carbon::parse($date);
            } catch (\Exception $e) {
                try {
                    $date = Carbon::createFromFormat($this->getPickerFormat(), $date);
                } catch (\Exception $e) {
                    Log::error('Unable to parse date!', [
                        'format' => $this->getPickerFormat(),
                        'date' => $date,
                        'exception' => $e,
                    ]);

                    return;
                }
            }
        }

        return $date->timezone($this->getTimezone())->format($this->getPickerFormat());
    }
}
