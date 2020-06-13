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
    public function getVisibled()
    {
        if (is_bool($this->visibled)) {
            return $this->visibled;
        }

        return (bool) $this->getValueFromObject($this->getModel(), $this->visibled);
    }

    /**
     * @param Closure|bool $visibled
     *
     * @return $this
     */
    public function setVisibled($visibled)
    {
        $this->visibled = $visibled;

        return $this;
    }
}
