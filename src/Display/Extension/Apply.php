<?php

namespace SleepingOwl\Admin\Display\Extension;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Apply extends Extension
{
    /**
     * @var Closure[]
     */
    protected $applies = [];

    /**
     * @return Closure[]
     */
    public function all()
    {
        return $this->applies;
    }

    /**
     * @param  Closure  $applies
     * @return \SleepingOwl\Admin\Contracts\Display\DisplayInterface
     */
    public function set($applies)
    {
        if (! is_array($applies)) {
            $applies = func_get_args();
        }

        foreach ($applies as $apply) {
            $this->push($apply);
        }

        return $this->getDisplay();
    }

    /**
     * @param  Closure  $apply
     * @return $this
     */
    public function push(Closure $apply)
    {
        $this->applies[] = $apply;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'applies' => $this->applies,
        ];
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     */
    public function modifyQuery(Builder $query)
    {
        foreach ($this->applies as $apply) {
            call_user_func($apply, $query);
        }
    }
}
