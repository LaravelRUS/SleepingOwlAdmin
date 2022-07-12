<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Closure;
use Illuminate\Database\Eloquent\Builder;

interface OrderByClauseInterface
{
    /**
     * @param  string|\Closure  $name
     */
    public function setName($name);

    /**
     * @param  Builder  $query
     * @param string $direction
     */
    public function modifyQuery(Builder $query, $direction = 'asc');
}
