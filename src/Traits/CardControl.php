<?php

namespace SleepingOwl\Admin\Traits;

trait CardControl
{
    /**
     * @var string|null
     */
    protected $cardClass = null;

    /**
     * @return string
     */
    public function getCardClass()
    {
        return $this->cardClass;
    }

    /**
     * @param  string  $class
     * @return $this
     */
    public function setCardClass($class)
    {
        $this->cardClass = $class;

        return $this;
    }
}
