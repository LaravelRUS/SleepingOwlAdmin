<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection as SuportCollection;
use SleepingOwl\Admin\Contracts\Display\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;
use SleepingOwl\Admin\Display\TableColumn;

abstract class NamedColumn extends TableColumn implements NamedColumnInterface
{
    /**
     * Column field name.
     *
     * @var string
     */
    protected $name;

    /**
     * @var bool
     */
    protected $orderable = true;

    /**
     * @var bool
     */
    protected $isSearchable = true;

    /**
     * NamedColumn constructor.
     *
     * @param $name
     * @param $label string|null
     * @param $small string|Closure|null
     */
    public function __construct($name, string $label = null, $small = null)
    {
        parent::__construct($label);
        $this->setName($name);

        if ($small) {
            $this->setSmall($small);
        }

        $this->setHtmlAttribute('class', 'row-'.strtolower(class_basename(get_called_class())));

        if ($this->orderable) {
            $this->setOrderable();
        }
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param  string  $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getModelValue()
    {
        return $this->getValueFromObject($this->getModel(), $this->getName());
    }

    /**
     * @param  OrderByClauseInterface|bool  $orderable
     * @return TableColumn
     */
    public function setOrderable($orderable = true)
    {
        if ($orderable !== false && ! $orderable instanceof OrderByClauseInterface) {
            if (! is_string($orderable) && ! $orderable instanceof Closure) {
                $orderable = $this->getName();
            }
        }

        return parent::setOrderable($orderable);
    }

    /**
     * @param $class
     * @return $this
     */
    public function setClass($class)
    {
        $this->setHtmlAttribute('class', $class);

        return $this;
    }

    /**
     * @return $this
     */
    public function nowrap()
    {
        $this->setClass('text-nowrap');

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        $model_value_small = $this->getSmall();
        if ($this->isolated) {
            $model_value_small = htmlspecialchars($model_value_small);
        }

        return parent::toArray() + [
            'name' => $this->getName(),
            'small' => $model_value_small,
            'visibled' => $this->getVisibled(),
        ];
    }

    /**
     * Get column value from instance.
     *
     * @param  Collection|Model|Closure  $instance
     * @param  string  $name
     * @return mixed
     */
    protected function getValueFromObject($instance, $name)
    {
        if ($name instanceof Closure) {
            return $name($instance);
        }

        /*
         * Implement json parsing
         */
        if (strpos($name, '.') === false && strpos($name, '->') !== false) {
            $casts = collect($instance->getCasts());
            $jsonParts = collect(explode('->', $name));

            $jsonAttr = $instance->{$jsonParts->first()};

            $cast = $casts->get($jsonParts->first(), false);

            if ($cast == 'object') {
                $jsonAttr = json_decode(json_encode($jsonAttr), true);
            } elseif ($cast != 'array') {
                $jsonAttr = json_decode($jsonAttr);
            }

            return Arr::get($jsonAttr, $jsonParts->slice(1)->implode('.'));
        }

        $parts = explode('.', $name);
        $part = array_shift($parts);

        if ($instance instanceof Collection) {
            $instance = $instance->pluck($part);
        } elseif ($instance instanceof SuportCollection) {
            $instance = $instance->first();
            if ($instance instanceof Collection) {
                $instance = $instance->pluck($part);
            }

            if ($instance === null) {
                $instance = collect();
            }
        } elseif (! is_null($instance)) {
            $instance = $instance->getAttribute($part);
        }

        if (! empty($parts) && ! is_null($instance)) {
            return $this->getValueFromObject($instance, implode('.', $parts));
        }

        return $instance;
    }
}
