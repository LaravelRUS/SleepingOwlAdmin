<?php

namespace SleepingOwl\Admin\Traits;

trait Collapsed
{
    /**
     * @return null|string
     */
    public function getCollapsed()
    {
        if (is_null($this->collapsed)) {
            $this->collapsed = false;
        }

        return $this->collapsed;
    }

    /**
     * @param  null|bool  $collapsed
     * @return $this
     */
    public function setCollapsed($collapsed)
    {
        $this->collapsed = $collapsed;

        return $this;
    }
}
