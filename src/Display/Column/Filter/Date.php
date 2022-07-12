<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Exceptions\FilterOperatorException;
use SleepingOwl\Admin\Traits\DateFormat;
use SleepingOwl\Admin\Traits\DatePicker;

class Date extends Text
{
    use DatePicker, DateFormat;

    /**
     * @var string
     */
    protected string $view = 'column.filter.date';

    /**
     * @var string|null
     */
    protected ?string $format = 'Y-m-d';

    /**
     * @var string
     */
    protected string $timezone;

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
     * @param  string  $date
     * @param  bool  $add_day
     * @return string
     *
     * @throws FilterOperatorException
     */
    public function parseValue($date, $add_day = false)
    {
        if (empty($date)) {
            return null;
        }

        //contains in date
        $this->setOperator('contains');

        if (! $date instanceof Carbon) {
            try {
                $date = Carbon::parse($date);
            } catch (Exception $e) {
                try {
                    $date = Carbon::createFromFormat($this->getPickerFormat(), $date);
                } catch (Exception $e) {
                    Log::error('Unable to parse date!', [
                        'format' => $this->getPickerFormat(),
                        'date' => $date,
                        'exception' => $e,
                    ]);

                    return null;
                }
            }
        }

        if ($add_day) {
            $date = $date->addDay();
        }

        return $date->timezone($this->getTimezone())->format($this->getFormat());
    }
}
