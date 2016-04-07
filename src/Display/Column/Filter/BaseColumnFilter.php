<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Meta;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators;

    /**
     * @var string
     */
    protected $view;

    /**
     * Initialize column filter.
     */
    public function initialize()
    {
        Meta::loadPackage(get_called_class());
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('column.filter.'.$this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
