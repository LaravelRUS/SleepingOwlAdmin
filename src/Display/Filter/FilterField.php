<?php

namespace SleepingOwl\Admin\Display\Filter;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Traits\SqlQueryOperators;

class FilterField extends FilterBase
{
    use SqlQueryOperators;

    /**
     * @param  mixed  $value
     * @return $this
     */
    public function setValue($value)
    {
        parent::setValue(
            $this->prepareValue($value)
        );

        return $this;
    }

    /**
     * @param  Builder  $query
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
}
