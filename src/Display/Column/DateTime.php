<?php

namespace SleepingOwl\Admin\Display\Column;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class DateTime extends NamedColumn
{
    /**
     * Datetime format.
     * @var string
     */
    protected $format;

    /**
     * @var string
     */
    protected $view = 'column.datetime';

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        parent::setModel($model);
        $this->setHtmlAttribute('data-value', $this->getModelValue());

        return $this;
    }

    /**
     * @return string
     */
    public function getFormat()
    {
        if (is_null($this->format)) {
            $this->format = config('sleeping_owl.datetimeFormat');
        }

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
        return parent::toArray() + [
            'value' => $this->getFormatedDate($value),
            'originalValue' => $value,
        ];
    }

    /**
     * @param string $date
     *
     * @return null|string
     */
    protected function getFormatedDate($date)
    {
        if (! is_null($date)) {
            if (! $date instanceof Carbon) {
                $date = Carbon::parse($date);
            }

            $date = $date->format($this->getFormat());
        }

        return $date;
    }
}
