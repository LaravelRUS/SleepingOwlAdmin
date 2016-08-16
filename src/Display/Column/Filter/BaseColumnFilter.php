<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use KodiComponents\Support\HtmlAttributes;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Traits\Assets;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators, HtmlAttributes, Assets;

    /**
     * @var string
     */
    protected $view;

    public function __construct()
    {
        $this->initializePackage();
    }

    /**
     * Initialize column filter.
     */
    public function initialize()
    {
        $this->includePackage();
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
        return [
            'attributes' => $this->htmlAttributesToString(),
        ];
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
