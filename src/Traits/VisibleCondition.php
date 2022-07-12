<?php

namespace SleepingOwl\Admin\Traits;

use Closure;

trait VisibleCondition
{
    /**
     * @var Closure|bool
     */
    protected Closure|bool $visibleCondition = true;

    /**
     * @return bool
     */
    public function isVisible(): bool
    {
        if (is_callable($this->visibleCondition)) {
            return (bool) call_user_func($this->visibleCondition, $this->getModel());
        }

        return (bool) $this->visibleCondition;
    }

    /**
     * @param bool|Closure $visibleCondition
     * @return $this
     */
    public function setVisible(bool|Closure $visibleCondition): VisibleCondition
    {
        $this->visibleCondition = $visibleCondition;

        return $this;
    }

    /**
     * @param  Closure  $condition
     * @return $this
     */
    public function setVisibilityCondition(Closure $condition): VisibleCondition
    {
        $this->visibleCondition = $condition;

        return $this;
    }
}
