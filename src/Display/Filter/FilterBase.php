<?php

namespace SleepingOwl\Admin\Display\Filter;

use Request;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\FilterInterface;
use SleepingOwl\Admin\Exceptions\FilterOperatorException;

abstract class FilterBase implements FilterInterface
{
    const EQUAL = 'equal';
    const NOT_EQUAL = 'not_equal';
    const LESS = 'less';
    const LESS_OR_EQUAL = 'less_or_equal';
    const GREATER = 'greater';
    const GREATER_OR_EQUAL = 'greater_or_equal';
    const BEGINS_WITH = 'begins_with';
    const NOT_BEGINS_WITH = 'not_begins_with';
    const CONTAINS = 'contains';
    const NOT_CONTAINS = 'not_contains';
    const ENDS_WITH = 'ends_with';
    const NOT_ENDS_WITH = 'not_ends_with';
    const IS_EMPTY = 'is_empty';
    const IS_NOT_EMPTY = 'is_not_empty';
    const IS_NULL = 'is_null';
    const IS_NOT_NULL = 'is_not_null';
    const BETWEEN = 'between';
    const NOT_BETWEEN = 'not_between';
    const IN = 'in';
    const NOT_IN = 'not_in';

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $alias;

    /**
     * @var string
     */
    protected $title;

    /**
     * @var mixed
     */
    protected $value;

    /**
     * @var string
     */
    protected $operator = 'equal';

    /**
     * @var array
     */
    protected $sqlOperators = [
        'equal'            => ['method' => 'where', 'op' => '='],
        'not_equal'        => ['method' => 'where', 'op' => '!='],
        'less'             => ['method' => 'where', 'op' => '<'],
        'less_or_equal'    => ['method' => 'where', 'op' => '<='],
        'greater'          => ['method' => 'where', 'op' => '>'],
        'greater_or_equal' => ['method' => 'where', 'op' => '>='],
        'begins_with'      => ['method' => 'where', 'op' => 'like', 'mod' => '?%'],
        'not_begins_with'  => ['method' => 'where', 'op' => 'not like', 'mod' => '?%'],
        'contains'         => ['method' => 'where', 'op' => 'like', 'mod' => '%?%'],
        'not_contains'     => ['method' => 'where', 'op' => 'not like', 'mod' => '%?%'],
        'ends_with'        => ['method' => 'where', 'op' => 'like', 'mod' => '%?'],
        'not_ends_with'    => ['method' => 'where', 'op' => 'not like', 'mod' => '%?'],
        'is_empty'         => ['method' => 'where', 'op' => '=', 'value' => ''],
        'is_not_empty'     => ['method' => 'where', 'op' => '!=', 'value' => ''],
        'is_null'          => ['method' => 'whereNull'],
        'is_not_null'      => ['method' => 'whereNotNull'],
        'between'          => ['method' => 'whereBetween'],
        'not_between'      => ['method' => 'whereNotBetween'],
        'in'               => ['method' => 'whereIn'],
        'not_in'           => ['method' => 'whereNotIn'],
    ];

    /**
     * @param string $name
     */
    public function __construct($name)
    {
        $this->setName($name);
        $this->setAlias($name);
    }

    /**
     * Initialize filter.
     */
    public function initialize()
    {
        if (is_null($value = $this->getValue())) {
            $value = Request::offsetGet($this->getAlias());
        }

        $params = $this->getOperatorParams();
        $method = $params['method'];
        switch ($method) {
            case 'where':
            case 'whereNull':
            case 'whereNotNull':
                break;
            case 'whereBetween':
            case 'whereNotBetween':
                if (! is_array($value)) {
                    $value = explode(',', $value, 2);
                }
                break;
            case 'whereIn':
            case 'whereNotIn':
                if (! is_array($value)) {
                    $value = explode(',', $value);
                }
                break;
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

        return $this->title;
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
     * @return string
     */
    public function getOperator()
    {
        return $this->operator;
    }

    /**
     * @param string $operator
     *
     * @return $this
     * @throws FilterOperatorException
     */
    public function setOperator($operator)
    {
        if (! array_key_exists($operator, $this->sqlOperators)) {
            throw new FilterOperatorException("Operator [$operator] not found");
        }

        $this->operator = $operator;

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

    /**
     * @param Builder $query
     */
    public function apply(Builder $query)
    {
        $name = $this->getName();
        $value = $this->getValue();
        $relationName = null;

        if (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $name = array_pop($parts);
            $relationName = implode('.', $parts);
        }

        if (! is_null($relationName)) {
            $query->whereHas($relationName, function ($q) use ($name, $value) {
                $this->buildQuery($q, $name, $value);
            });
        } else {
            $this->buildQuery($query, $name, $value);
        }
    }

    /**
     * @param Builder      $query
     * @param string       $column
     * @param string|array $value
     */
    protected function buildQuery(Builder $query, $column, $value)
    {
        $params = $this->getOperatorParams();
        $method = $params['method'];

        switch ($method) {
            case 'where':
                $value = str_replace('?', $value, array_get($params, 'mod', '?'));
                $query->where($column, $params['op'], $value);
                break;
            case 'whereNull':
            case 'whereNotNull':
                $query->{$method}($column);
                break;
            case 'whereBetween':
            case 'whereNotBetween':
                $query->{$method}($column, (array) $value);
                break;
            case 'whereIn':
            case 'whereNotIn':
                $query->{$method}($column, (array) $value);
                break;
        }
    }

    /**
     * @return array
     */
    protected function getOperatorParams()
    {
        return array_get($this->sqlOperators, $this->getOperator(), ['method' => 'where', 'op' => '=']);
    }
}
