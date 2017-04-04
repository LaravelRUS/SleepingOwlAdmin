<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Database\Eloquent\Builder;


/**
 * Interface ColumnMetaInterface
 * @package SleepingOwl\Admin\Contracts\Display
 *
 * @method onSearch(NamedColumnInterface $column, Builder $query, $queryString)
 * @method onFilterSearch(NamedColumnInterface $column, Builder $query, $queryString, $queryParams)
 * @method onOrderBy(NamedColumnInterface $column, Builder $query, $direction)
 */
interface ColumnMetaInterface
{
}
