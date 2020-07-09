<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Traits\DateFormat;
use SleepingOwl\Admin\Traits\DatePicker;

class Date extends Text
{
    use DatePicker, DateFormat;

    /**
     * @var string
     */
    protected $view = 'column.filter.date';

    /**
     * @var string
     */
    protected $format = 'Y-m-d';

    /**
     * @var bool
     */
    protected $seconds = false;

    /**
     * @var string
     */
    protected $timezone;

    public function initialize()
    {
        parent::initialize();
        $this->setHtmlAttribute('data-type', 'date');
    }

    /**
     * @return bool
     */
    public function hasSeconds()
    {
        return $this->seconds;
    }

    /**
     * @param bool $status
     *
     * @return $this
     * @deprecated use showSeconds
     */
    public function setSeconds($status)
    {
        return $this->showSeconds($status);
    }

    /**
     * @param bool $status
     *
     * @return $this
     */
    public function showSeconds($status = true)
    {
        $this->seconds = (bool) $status;

        return $this;
    }

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.dateFormat');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'seconds' => $this->hasSeconds(),
            'pickerFormat' => $this->getJsPickerFormat(),
        ];
    }

    /**
     * @param string $date
     *
     * @return string
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

        return $date->timezone($this->getTimezone())->format($this->getFormat());
    }
}
