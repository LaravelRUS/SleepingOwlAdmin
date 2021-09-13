<?php

namespace SleepingOwl\Admin\Display\Filter;

use Illuminate\Database\Eloquent\Builder;

class FilterScope extends FilterBase
{
    /**
     * @param  Builder  $query
     */
    public function apply(Builder $query)
    {
        call_user_func([$query, $this->getName()], $this->getValue());
    }
}
