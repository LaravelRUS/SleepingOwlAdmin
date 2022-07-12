<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;

abstract class Extension implements DisplayExtensionInterface
{
    /**
     * @var DisplayInterface
     */
    protected DisplayInterface $display;

    /**
     * @var int
     */
    protected int $order = 0;

    /**
     * @return DisplayInterface
     */
    public function getDisplay(): DisplayInterface
    {
        return $this->display;
    }

    /**
     * @param  DisplayInterface  $display
     * @return $this
     */
    public function setDisplay(DisplayInterface $display): self
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @param  Builder  $query
     */
    public function modifyQuery(Builder $query)
    {
        //Implement modifyQuery() method.
    }

    /**
     * @return int
     */
    public function getOrder(): int
    {
        return $this->order;
    }

    /**
     * @param  int  $order
     * @return $this
     */
    public function setOrder(int $order): self
    {
        $this->order = (int) $order;

        return $this;
    }
}
