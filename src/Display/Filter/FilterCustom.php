<?php

namespace SleepingOwl\Admin\Display\Filter;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class FilterCustom extends FilterField
{
    /**
     * @var Closure
     */
    protected $callback;

    /**
     * @param  string  $name
     * @param  string|\Closure|null  $title
     * @param  Closure  $callback
     */
    public function __construct($name, $title = null, Closure $callback = null)
    {
        parent::__construct($name, $title);

        if (! is_null($callback)) {
            $this->setCallback($callback);
        }
    }

    /**
     * @param  Builder  $query
     */
    public function apply(Builder $query)
    {
        call_user_func($this->getCallback(), $query, $this->getValue());
    }

    /**
     * @return Closure
     */
    public function getCallback()
    {
        return $this->callback;
    }

    /**
     * @param  Closure  $callback
     * @return $this
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }
}
