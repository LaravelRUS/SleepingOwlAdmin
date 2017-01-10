<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use SleepingOwl\Admin\Traits\Assets;
use KodiComponents\Support\HtmlAttributes;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators, HtmlAttributes, Assets, \SleepingOwl\Admin\Traits\Renderable;

    /**
     * @var \Closure|null
     */
    protected $callback;

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
     * @param NamedColumnInterface $column
     * @param Builder              $query
     * @param string               $queryString
     * @param array|string         $queryParams
     *
     * @return void
     */
    public function apply(
        NamedColumnInterface $column,
        Builder $query,
        $queryString,
        $queryParams
    ) {
        $queryString = $this->parseValue($queryString);

        if (empty($queryString)) {
            return;
        }

        $name = $column->getName();

        if (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $fieldName = array_pop($parts);
            $relationName = implode('.', $parts);

            $query->whereHas($relationName, function ($q) use ($queryString, $fieldName) {
                $this->buildQuery($q, $fieldName, $queryString);
            });
        } else {
            $this->buildQuery($query, $name, $queryString);
        }
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
            'attributesArray' => $this->getHtmlAttributes(),
        ];
    }
}
