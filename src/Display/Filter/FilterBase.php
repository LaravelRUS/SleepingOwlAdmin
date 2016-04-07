<?php

namespace SleepingOwl\Admin\Display\Filter;

use Request;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\FilterInterface;
use SleepingOwl\Admin\Traits\SqlQueryOperators;

abstract class FilterBase implements FilterInterface
{
    use SqlQueryOperators;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $alias;

    /**
     * @var string
     */
    protected $title;

    /**
     * @var mixed
     */
    protected $value;

    /**
     * @param string $name
     */
    public function __construct($name)
    {
        $this->setName($name);
        $this->setAlias($name);
    }

    /**
     * Initialize filter.
     */
    public function initialize()
    {
        if (is_null($value = $this->getValue())) {
            $value = Request::offsetGet($this->getAlias());
        }

        $value = $this->prepareValue($value);

        $this->setValue($value);
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
    public function getAlias()
    {
        return $this->alias;
    }

    /**
     * @param string $alias
     *
     * @return $this
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (is_callable($this->title)) {
            return call_user_func($this->title, $this->getValue());
        }

        return $this->title;
    }

    /**
     * @param Closure|string $title
     *
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     *
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return ! is_null($this->getValue());
    }

    /**
     * @param Builder $query
     */
    public function apply(Builder $query)
    {
        $name = $this->getName();
        $value = $this->getValue();
        $relationName = null;

        if (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $name = array_pop($parts);
            $relationName = implode('.', $parts);
        }

        if (! is_null($relationName)) {
            $query->whereHas($relationName, function ($q) use ($name, $value) {
                $this->buildQuery($q, $name, $value);
            });
        } else {
            $this->buildQuery($query, $name, $value);
        }
    }
}
