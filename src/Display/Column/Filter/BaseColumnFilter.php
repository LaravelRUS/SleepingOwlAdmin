<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use SleepingOwl\Admin\Traits\Assets;
use Illuminate\Database\Eloquent\Builder;
use KodiComponents\Support\HtmlAttributes;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnMetaInterface;
use SleepingOwl\Admin\Contracts\Display\Extension\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators, HtmlAttributes, Assets, \SleepingOwl\Admin\Traits\Renderable;

    protected $view;

    /**
     * @var \Closure|null
     */
    protected $callback;

    /**
     * @var string|null
     */
    protected $columnName;

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
     * @return null|string
     */
    public function getColumnName()
    {
        return $this->columnName;
    }

    /**
     * @param null|string $name
     *
     * @return $this
     */
    public function setColumnName($name)
    {
        $this->columnName = $name;

        return $this;
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
     * @deprecated
     * @return \Closure|null
     */
    public function getCallback()
    {
        return $this->callback;
    }

    /**
     * @param \Closure $callback
     * @deprecated
     * @return $this
     */
    public function setCallback(\Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }

    /**
     * @param ColumnInterface $column
     * @param Builder $query
     * @param string $queryString
     * @param array|string $queryParams
     *
     * @return void
     */
    public function apply(ColumnInterface $column, Builder $query, $queryString, $queryParams)
    {
        $queryString = $this->parseValue($queryString);

        if (($metaInstance = $column->getMetaData()) instanceof ColumnMetaInterface) {
            if (method_exists($metaInstance, 'onFilterSearch')) {
                $metaInstance->onFilterSearch($column, $query, $queryString, $queryParams);

                return;
            }
        }

        if (is_callable($callback = $column->getFilterCallback())) {
            $callback($column, $query, $queryString, $queryParams);

            return;
        }

        if (is_callable($callback = $this->getCallback())) {
            $callback($column, $query, $queryString, $queryParams);

            return;
        }

        if (empty($queryString) && strlen($queryString) == 0) {
            return;
        }

        if (is_null($name = $this->getColumnName())) {
            $name = $column->getName();
        }

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
            'attributes'      => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
        ];
    }
}
