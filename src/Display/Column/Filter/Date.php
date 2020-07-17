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
     * @var string
     */
    protected $timezone;

    public function initialize()
    {
        parent::initialize();
        $this->setHtmlAttribute('data-type', 'date');
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

        //contains in date
        $this->setOperator('contains');

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
