<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Closure;
use Illuminate\Database\Eloquent\Builder;

interface OrderByClauseInterface
{
    /**
     * @param  Closure|string  $name
     */
    public function setName(Closure|string $name);

    /**
     * @param  Builder  $query
     * @param  string  $direction
     */
    public function modifyQuery(Builder $query, $direction = 'asc');
}
