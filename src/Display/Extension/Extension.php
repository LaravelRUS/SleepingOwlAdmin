<?php

namespace SleepingOwl\Admin\Display\Extension;

use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;

abstract class Extension implements DisplayExtensionInterface
{
    /**
     * @var DisplayInterface
     */
    protected $display;

    /**
     * @var int
     */
    protected $order = 0;

    /**
     * @return DisplayInterface
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param DisplayInterface $display
     *
     * @return $this
     */
    public function setDisplay(DisplayInterface $display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder $query
     */
    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        // TODO: Implement modifyQuery() method.
    }

    /**
     * @return int
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @param int $order
     *
     * @return $this
     */
    public function setOrder($order)
    {
        $this->order = (int) $order;

        return $this;
    }
}
