<?php

namespace SleepingOwl\Admin\Traits;

trait PanelControl
{
    /**
     * @var string|null
     */
    protected $panelClass = null;

    /**
     * @return string
     */
    public function getPanelClass()
    {
        return $this->panelClass;
    }

    /**
     * @param string $class
     *
     * @return $this
     */
    public function setPanelClass($class)
    {
        $this->panelClass = $class;

        return $this;
    }
}
