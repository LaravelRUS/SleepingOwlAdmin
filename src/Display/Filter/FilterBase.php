<?php

namespace SleepingOwl\Admin\Display\Filter;

use Closure;
use Illuminate\Support\Str;
use SleepingOwl\Admin\Contracts\Display\Extension\FilterInterface;

abstract class FilterBase implements FilterInterface
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $alias;

    /**
     * @var string|\Closure|null
     */
    protected $title;

    /**
     * @var mixed
     */
    protected $value;

    /**
     * @param  string  $name
     * @param  string|\Closure|null  $title
     */
    public function __construct($name, $title = null)
    {
        $this->setName($name);

        if (! is_null($title)) {
            $this->setTitle($title);
        }
    }

    /**
     * Initialize filter.
     */
    public function initialize()
    {
        if (is_null($value = $this->getValue())) {
            $value = request()->input($this->getAlias());
        }

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
     * @param  string  $name
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
        if (! $this->alias) {
            return $this->getName();
        }

        return $this->alias;
    }

    /**
     * @param  string  $alias
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
        if (is_null($this->title)) {
            return Str::studly($this->getAlias());
        }

        if (is_callable($this->title)) {
            return call_user_func($this->title, $this->getValue());
        }

        return strtr($this->title, [':value' => $this->getValue()]);
    }

    /**
     * @param  Closure|string  $title
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
     * @param  mixed  $value
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
}
