<?php

namespace SleepingOwl\Admin\Contracts\Display\Extension;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\Initializable;

interface FilterInterface extends Initializable
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
     * Initialize filter.
     */
    public function initialize();

    /**
     * Is filter active?
     *
     * @return bool
     */
    public function isActive();

    /**
     * @return string
     */
    public function getTitle();

    /**
     * Apply filter to the query.
     *
     * @param  Builder  $query
     */
    public function apply(Builder $query);
}
