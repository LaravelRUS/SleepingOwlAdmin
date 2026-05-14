<?php

namespace SleepingOwl\Admin\Support;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Support\Http\QueryFilters;

/**
 * Class Filterable.
 *
 * @method static filter(QueryFilters $filters)
 */
trait Filterable
{
    /**
     * Filter a result set.
     *
     * @param  Builder  $query
     * @param  QueryFilters  $filters
     * @return Builder
     */
    public function scopeFilter($query, QueryFilters $filters)
    {
        return $filters->apply($query);
    }
}
