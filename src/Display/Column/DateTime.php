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
     * DateTime constructor.
     *
     * @param null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
    }

    /**
     * Initialize column.
     */
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', 'row-date');
    }

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
        $value         = $this->getModelValue();
        $originalValue = $value;

        if (! is_null($value)) {
            if (! $value instanceof Carbon) {
                $value = Carbon::parse($value);
            }

            $value = $value->format($this->getFormat());
        }

        return parent::toArray() + [
            'value' => $value,
            'originalValue' => $originalValue,
            'append' => $this->getAppends(),
        ];
    }
}
