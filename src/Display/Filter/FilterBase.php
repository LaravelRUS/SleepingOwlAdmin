<?php

namespace SleepingOwl\Admin\Display\Filter;

use Closure;
use Illuminate\Support\Facades\Request;
use SleepingOwl\Admin\Contracts\FilterInterface;

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
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * @param \Illuminate\Http\Request $request
     * @param string $name
     * @param string|\Closure|null $title
     */
    public function __construct(\Illuminate\Http\Request $request, $name, $title = null)
    {
        $this->request = $request;

        $this->setName($name);
        $this->setAlias($name);

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
            $value = $this->request->input($this->getAlias());
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

        return strtr($this->title, [':value' => $this->getValue()]);
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
}
