<?php

namespace SleepingOwl\Admin\Traits;

use Closure;

trait VisibleCondition
{
    /**
     * @var Closure|bool
     */
    protected $visibleCondition = true;

    /**
     * @return bool
     */
    public function isVisible()
    {
        if (is_callable($this->visibleCondition)) {
            return (bool) call_user_func($this->visibleCondition, $this->getModel());
        }

        return (bool) $this->visibleCondition;
    }

    /**
     * @param  Closure|bool  $visibleCondition
     * @return $this
     */
    public function setVisible($visibleCondition)
    {
        $this->visibleCondition = $visibleCondition;

        return $this;
    }

    /**
     * @param  Closure  $condition
     * @return $this
     */
    public function setVisibilityCondition(Closure $condition)
    {
        $this->visibleCondition = $condition;

        return $this;
    }
}
