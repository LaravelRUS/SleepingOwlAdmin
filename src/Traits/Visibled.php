<?php

namespace SleepingOwl\Admin\Traits;

use Closure;

trait Visibled
{
    /**
     * @var bool|callable
     */
    protected $visibled = true;

    /**
     * @return bool|callable
     */
    public function isVisible()
    {
        if (is_callable($this->visibled)) {
            return (bool) call_user_func($this->visibled, $this->getModel());
        }

        return (bool) $this->visibled;
    }

    /**
     * @param Closure|bool $visibled
     *
     * @return $this
     */
    public function setVisible($visibled)
    {
        $this->visibled = $visibled;

        return $this;
    }
}
