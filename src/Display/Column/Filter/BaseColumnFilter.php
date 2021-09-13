<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Closure;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Database\Eloquent\Builder;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnMetaInterface;
use SleepingOwl\Admin\Contracts\Display\Extension\ColumnFilterInterface;
use SleepingOwl\Admin\Traits\Assets;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Traits\Width;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators, HtmlAttributes, Assets, Width, \SleepingOwl\Admin\Traits\Renderable;

    protected $view;

    /**
     * @var \Closure|null
     */
    protected $callback;

    /**
     * @var string|null
     */
    protected $columnName;

    /**
     * @var string|null
     */
    protected $columnRawName;

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
     * @param  null|string  $name
     * @return $this
     */
    public function setColumnName($name)
    {
        $this->columnName = $name;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getColumnRawName()
    {
        return $this->columnRawName;
    }

    /**
     * @param  null|string  $name
     * @return $this
     */
    public function setColumnRawName($name)
    {
        $this->columnRawName = $name;

        return $this;
    }

    /**
     * @param  mixed  $value
     * @return mixed
     */
    public function parseValue($value)
    {
        return $value;
    }

    /**
     * @return \Closure|null
     *
     * @deprecated
     */
    public function getCallback()
    {
        return $this->callback;
    }

    /**
     * @param  \Closure  $callback
     * @return $this
     *
     * @deprecated
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }

    /**
     * @param  ColumnInterface  $column
     * @param  Builder  $query
     * @param  string  $queryString
     * @param  array|string  $queryParams
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

        if (is_null($name = $this->getColumnRawName())) {
            if (is_null($name = $this->getColumnName())) {
                $name = $column->getName();
            }
        }

        if (strpos($name, '.') !== false && is_null($this->getColumnRawName())) {
            $parts = explode('.', $name);
            $fieldName = array_pop($parts);
            $relationName = implode('.', $parts);
            try {
                $relation = $query->getModel()->{$relationName}();
                $fieldName = $relation->getModel()->getTable().'.'.$fieldName;
                $isMorphTo = $relation instanceof \Illuminate\Database\Eloquent\Relations\MorphTo;
            } catch (\Exception $e) {
                $isMorphTo = false;
            }

            if ($isMorphTo) {
                $query->whereHasMorph($relationName, '*', function ($q) use ($queryString, $fieldName) {
                    $this->buildQuery($q, $fieldName, $queryString);
                });
            } else {
                $query->whereHas($relationName, function ($q) use ($queryString, $fieldName) {
                    $this->buildQuery($q, $fieldName, $queryString);
                });
            }
            unset($relation);
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
        $width = '';
        if ($this->getWidth()) {
            $width = 'style="width: '.$this->getWidth().'"';
        }

        return [
            'width' => $width,
            'attributes' => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
        ];
    }
}
