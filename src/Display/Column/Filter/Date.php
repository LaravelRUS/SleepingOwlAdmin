<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Exception;
use Carbon\Carbon;

class Date extends Text
{
    use \SleepingOwl\Admin\Traits\DatePicker;

    /**
     * @var string
     */
    protected $view = 'column.filter.date';

    /**
     * @var string
     */
    protected $format;

    /**
     * @var string
     */
    protected $searchFormat = 'Y-m-d';

    /**
     * @var bool
     */
    protected $seconds = false;

    /**
     * @var int
     */
    protected $width = 150;

    public function initialize()
    {
        parent::initialize();
        $this->setHtmlAttribute('data-type', 'date');
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
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param int $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        intval($width);

        if ($width < 0) {
            $width = 0;
        }

        $this->width = (int) $width;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'seconds'      => $this->hasSeconds(),
            'pickerFormat' => $this->getJsPickerFormat(),
            'width'        => $this->getWidth(),
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

        try {
            $date = Carbon::parse($date);
        } catch (Exception $e) {
            try {
                $date = Carbon::createFromFormat($this->getPickerFormat(), $date);
            } catch (Exception $e) {
                return;
            }
        }

        return $date->format($this->getFormat());
    }
}
