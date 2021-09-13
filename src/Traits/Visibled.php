<?php

namespace SleepingOwl\Admin\Traits;

use Closure;

trait Visibled
{
    /**
     * @var Closure|bool
     */
    protected $visibled = true;

    /**
     * @return Closure|bool
     */
    public function getVisibled()
    {
        if (is_callable($this->visibled)) {
            return (bool) call_user_func($this->visibled, $this->getModel());
        }

        return (bool) $this->visibled;
    }

    /**
     * @param  Closure|bool  $visibled
     * @return $this
     */
    public function setVisibled($visibled)
    {
        $this->visibled = $visibled;

        return $this;
    }
}
