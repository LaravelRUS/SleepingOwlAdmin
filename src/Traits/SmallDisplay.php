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
     * @param  string|Closure  $small
     * @param  bool  $asString
     * @return $this
     */
    public function setSmall($small, $asString = false)
    {
        $this->small = $small;
        $this->smallString = $asString;

        return $this;
    }

    /**
     * @param  bool  $isolatedHTML
     * @return $this
     */
    public function setIsolated($isolatedHTML)
    {
        $this->isolated = $isolatedHTML;

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
