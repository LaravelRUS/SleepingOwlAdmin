<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Builder;

interface FilterInterface extends Initializable
{
    /**
     * Initialize filter.
     */
    public function initialize();

    /**
     * Is filter active?
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
     * @param Builder $query
     */
    public function apply(Builder $query);
}
