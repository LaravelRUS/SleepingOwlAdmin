<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Display\TableColumn;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SuportCollection;
use SleepingOwl\Admin\Contracts\Display\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;

abstract class NamedColumn extends TableColumn implements NamedColumnInterface
{
    /**
     * Column field name.
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $small;

    /**
     * @var bool
     */
    protected $orderable = true;

    /**
     * NamedColumn constructor.
     * @param $name
     * @param $label string
     * @param $small string
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($label);
        $this->setName($name);
        $this->setSmall($small);

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
     * @param string $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getSmall()
    {
        return $this->small;
    }

    /**
     * @param string $small
     *
     * @return $this
     */
    public function setSmall($small)
    {
        $this->small = $small;

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
     * @return mixed
     */
    public function getModelSmallValue()
    {
        return $this->getValueFromObject($this->getModel(), $this->getSmall());
    }

    /**
     * @param OrderByClauseInterface|bool $orderable
     * @deprecated
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
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
                'name' => $this->getName(),
            ];
    }

    /**
     * Get column value from instance.
     *
     * @param Collection|Model|Closure $instance
     * @param string $name
     *
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
