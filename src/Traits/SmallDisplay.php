<?php

namespace SleepingOwl\Admin\Traits;

use Closure;

trait SmallDisplay
{
    /**
     * @var string
     * @var bool
     */
    protected $small;
    protected $smallString = false;

    /**
     * @var bool
     */
    protected $isolated = true;

    /**
     * @return string
     */
    public function getSmall()
    {
        if ($this->smallString) {
            return $this->small;
        }

        return $this->getValueFromObject($this->getModel(), $this->small);
    }

    /**
     * @param string|Closure $small
     *
     * @return $this
     */
    public function setSmall($small, $smallString = false)
    {
        $this->small = $small;
        $this->smallString = $smallString;

        return $this;
    }

    /**
     * @param bool $isolated
     *
     * @return $this
     */
    public function setIsolated($isolated)
    {
        $this->isolated = $isolated;

        return $this;
    }

    /**
     * @return string
     */
    public function getIsolated()
    {
        return $this->isolated;
    }
}
