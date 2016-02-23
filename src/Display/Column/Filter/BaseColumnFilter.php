<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Meta;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
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
     * @return array
     */
    public function getParams()
    {
        return [];
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return $this->getParams();
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('column.filter.'.$this->getView(), $this->getParams())->render();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
