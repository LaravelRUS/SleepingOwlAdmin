<?php

namespace SleepingOwl\Admin\Traits;

use DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Grammars\PostgresGrammar;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Exceptions\FilterOperatorException;

trait SqlQueryOperators
{
    /**
     * @var string
     */
    protected $operator = 'equal';

    /**
     * @var array
     */

    protected $sqlOperators = [

    ];
    protected $ilikeSqlOperators = [
        'begins_with' => ['method' => 'where', 'op' => 'ilike', 'mod' => '?%'],
        'not_begins_with' => ['method' => 'where', 'op' => 'not ilike', 'mod' => '?%'],
        'contains' => ['method' => 'where', 'op' => 'ilike', 'mod' => '%?%'],
        'not_contains' => ['method' => 'where', 'op' => 'not ilike', 'mod' => '%?%'],
        'ends_with' => ['method' => 'where', 'op' => 'ilike', 'mod' => '%?'],
        'not_ends_with' => ['method' => 'where', 'op' => 'not ilike', 'mod' => '%?'],
    ];

    protected $preSqlOperators = [
        'equal' => ['method' => 'where', 'op' => '='],
        'not_equal' => ['method' => 'where', 'op' => '!='],
        'less' => ['method' => 'where', 'op' => '<'],
        'less_or_equal' => ['method' => 'where', 'op' => '<='],
        'greater' => ['method' => 'where', 'op' => '>'],
        'greater_or_equal' => ['method' => 'where', 'op' => '>='],
        'begins_with' => ['method' => 'where', 'op' => 'like', 'mod' => '?%'],
        'not_begins_with' => ['method' => 'where', 'op' => 'not like', 'mod' => '?%'],
        'contains' => ['method' => 'where', 'op' => 'like', 'mod' => '%?%'],
        'not_contains' => ['method' => 'where', 'op' => 'not like', 'mod' => '%?%'],
        'ends_with' => ['method' => 'where', 'op' => 'like', 'mod' => '%?'],
        'not_ends_with' => ['method' => 'where', 'op' => 'not like', 'mod' => '%?'],
        'is_empty' => ['method' => 'where', 'op' => '=', 'value' => ''],
        'is_not_empty' => ['method' => 'where', 'op' => '!=', 'value' => ''],
        'is_null' => ['method' => 'whereNull'],
        'is_not_null' => ['method' => 'whereNotNull'],
        'between' => ['method' => 'whereBetween'],
        'not_between' => ['method' => 'whereNotBetween'],
        'in' => ['method' => 'whereIn'],
        'not_in' => ['method' => 'whereNotIn'],
    ];

    /**
     * @return string
     */
    public function getOperator()
    {
        return $this->operator;
    }

    public function getSqlOperators()
    {
        if ($this->sqlOperators) {
            return $this->sqlOperators;
        }
        if (DB::query()->getGrammar() instanceof PostgresGrammar && mb_strtolower(config('sleeping_owl.search_operator')) === 'ilike') {
            return $this->sqlOperators = array_merge($this->preSqlOperators, $this->ilikeSqlOperators);
        }
        return $this->sqlOperators = $this->preSqlOperators;
    }

    /**
     * @param  string  $operator
     * @return $this
     *
     * @throws FilterOperatorException
     */
    public function setOperator($operator)
    {
        if (! array_key_exists($operator, $this->getSqlOperators())) {
            throw new FilterOperatorException("Operator [$operator] not found");
        }

        $this->operator = $operator;

        return $this;
    }

    /**
     * @param  Builder  $query
     * @param  string  $column
     * @param  string|array  $value
     */
    protected function buildQuery(Builder $query, $column, $value)
    {
        $params = $this->getOperatorParams();
        $method = $params['method'];
        $value = Arr::get($params, 'value', $value);

        switch ($method) {
            case 'where':
                $value = str_replace('?', $value, Arr::get($params, 'mod', '?'));
                $query->{$method}($column, $params['op'], $value);
                break;
            case 'whereNull':
            case 'whereNotNull':
                $query->{$method}($column);
                break;
            case 'whereBetween':
            case 'whereNotBetween':
                if (! is_array($value)) {
                    $value = explode(',', $value);
                }
                $query->{$method}($column, $value);
                break;
            case 'whereIn':
            case 'whereNotIn':
                if (! is_array($value)) {
                    $value = explode(',', $value);
                }
                $query->{$method}($column, $value);
                break;
        }
    }

    /**
     * @return array
     */
    protected function getOperatorParams()
    {
        return Arr::get($this->getSqlOperators(), $this->getOperator(), ['method' => 'where', 'op' => '=']);
    }

    /**
     * @param  string|array  $value
     * @return string|array
     */
    protected function prepareValue($value)
    {
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

        return $value;
    }
}
