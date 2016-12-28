<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use SleepingOwl\Admin\Traits\Assets;
use KodiComponents\Support\HtmlAttributes;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators, HtmlAttributes, Assets, \SleepingOwl\Admin\Traits\Renderable;

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
     * @param mixed $value
     *
     * @return mixed
     */
    public function parseValue($value)
    {
        return $value;
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
}
