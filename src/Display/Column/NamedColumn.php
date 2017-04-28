<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Display\TableColumn;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SuportCollection;
use SleepingOwl\Admin\Contracts\Display\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;

abstract class NamedColumn extends TableColumn implements NamedColumnInterface
{
    /**
     * @var \Closure
     */
    protected $searchCallback = null;

    /**
     * @var \Closure
     */
    protected $searchOuterCallback = null;

    /**
     * @var \Closure
     */
    protected $orderCallback = null;

    /**
     * @var \Closure
     */
    protected $filterCallback = null;

    /**
     * @var null
     */
    protected $columMetaClass = null;

    /**
     * Column field name.
     * @var string
     */
    protected $name;

    /**
     * @var bool
     */
    protected $orderable = true;

    /**
     * @param Closure|null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($label);
        $this->setName($name);

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
     * @param $columnMetaClass
     * @return $this
     */
    public function setMetaData($columnMetaClass)
    {
        $this->columMetaClass = $columnMetaClass;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getMetaData()
    {
        return $this->columMetaClass
            ? app()->make($this->columMetaClass)
            : false;
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setOrderCallback(\Closure $callable)
    {
        $this->orderCallback = $callable;

        return $this->setOrderable($callable);
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setSearchCallback(\Closure $callable)
    {
        $this->searchCallback = $callable;

        return $this;
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setSearchOuterCallback(\Closure $callable)
    {
        $this->searchOuterCallback = $callable;

        return $this;
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setFilterCallback(\Closure $callable)
    {
        $this->filterCallback = $callable;

        return $this;
    }

    /**
     * @return \Closure
     */
    public function getOrderCallback()
    {
        return $this->orderCallback;
    }

    /**
     * @return \Closure
     */
    public function getSearchCallback()
    {
        return $this->searchCallback;
    }

    /**
     * @return \Closure
     */
    public function getSearchOuterCallback()
    {
        return $this->searchOuterCallback;
    }

    /**
     * @return \Closure
     */
    public function getFilterCallback()
    {
        return $this->filterCallback;
    }

    /**
     * @return mixed
     */
    public function getModelValue()
    {
        return $this->getValueFromObject($this->getModel(), $this->getName());
    }

    /**
     * @param OrderByClauseInterface|bool $orderable
     * @deprecated
     * @return $this
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

        $parts = explode('.', $name);
        $part = array_shift($parts);

        if ($instance instanceof Collection) {
            $instance = $instance->pluck($part);
        } elseif ($instance instanceof SuportCollection) {
            $instance = $instance->first();
            if ($instance instanceof Collection) {
                $instance = $instance->pluck($part);
            }

            if ($instance == null) {
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
