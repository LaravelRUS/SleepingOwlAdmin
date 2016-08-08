<?php

namespace SleepingOwl\Admin\Display\Column;

use Carbon\Carbon;
use Illuminate\Config\Repository;
use Illuminate\Database\Eloquent\Model;
use KodiCMS\Assets\Contracts\MetaInterface;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

class DateTime extends NamedColumn
{
    /**
     * Datetime format.
     * @var string
     */
    protected $format;

    /**
     * @var Repository
     */
    protected $config;

    /**
     * DateTime constructor.
     *
     * @param Closure|null|string $name
     * @param null|string $label
     * @param TableHeaderColumnInterface $tableHeaderColumn
     * @param AdminInterface $admin
     * @param MetaInterface $meta
     * @param Repository $config
     */
    public function __construct($name,
                                $label,
                                TableHeaderColumnInterface $tableHeaderColumn,
                                AdminInterface $admin,
                                MetaInterface $meta,
                                Repository $config)
    {
        $this->config = $config;
        parent::__construct($name, $label, $tableHeaderColumn, $admin, $meta);
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
            $this->format = $this->config->get('sleeping_owl.datetimeFormat', 'd.m.Y H:i');
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
     * @return array
     */
    public function toArray()
    {
        $value = $this->getModelValue();
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
