<?php

namespace SleepingOwl\Admin\Traits;

trait Collapsed
{
    /**
     * @return null|bool
     */
    public function getCollapsed(): ?bool
    {
        if (is_null($this->collapsed)) {
            $this->collapsed = false;
        }

        return $this->collapsed;
    }

    /**
     * @param bool|null $collapsed
     * @return $this
     */
    public function setCollapsed(?bool $collapsed): Collapsed
    {
        $this->collapsed = $collapsed;

        return $this;
    }
}
