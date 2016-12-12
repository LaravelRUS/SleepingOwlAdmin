<?php

namespace SleepingOwl\Admin\Display\Column;

use Mockery\Matcher\Closure;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;

class OrderByClause implements OrderByClauseInterface
{
    /**
     * @var string|Closure
     */
    protected $name;

    /**
     * OrderByClause constructor.
     *
     * @param string|Closure $name
     */
    public function __construct($name)
    {
        $this->setName($name);
    }

    /**
     * @param Builder $query
     * @param string $direction
     */
    public function modifyQuery(Builder $query, $direction = 'asc')
    {
        $this->name instanceof \Closure
            ? $this->callCallable($query, $direction)
            : $this->callDefaultClause($query, $direction);
    }

    /**
     * @param string|Closure $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param Builder $query
     * @param string $direction
     */
    protected function callCallable(Builder $query, $direction)
    {
        call_user_func_array($this->name, [$query, $direction]);
    }

    /**
     * @param Builder $query
     * @param string $direction
     */
    protected function callDefaultClause(Builder $query, $direction)
    {
        $query->orderBy($this->name, $direction);
    }
}
