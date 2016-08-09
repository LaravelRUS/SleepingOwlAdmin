<?php

namespace SleepingOwl\Admin\Display\Filter;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

class FilterCustom extends FilterField
{
    /**
     * @var Closure
     */
    protected $callback;

    /**
     * @param TemplateInterface $template
     * @param string $name
     * @param string|\Closure|null $title
     * @param Closure $callback
     */
    public function __construct(TemplateInterface $template, $name, $title = null, Closure $callback = null)
    {
        parent::__construct($template, $name, $title);

        if (! is_null($callback)) {
            $this->setCallback($callback);
        }
    }

    /**
     * @param Builder $query
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
     * @param Closure $callback
     *
     * @return $this
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }
}
