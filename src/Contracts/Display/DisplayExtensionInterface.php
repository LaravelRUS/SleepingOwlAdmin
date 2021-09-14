<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Builder;

interface DisplayExtensionInterface extends Arrayable
{
    /**
     * @return int
     */
    public function getOrder();

    /**
     * @param  int  $order
     * @return $this
     */
    public function setOrder($order);

    /**
     * @return DisplayInterface
     */
    public function getDisplay();

    /**
     * @param  DisplayInterface  $display
     * @return $this
     */
    public function setDisplay(DisplayInterface $display);

    /**
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     */
    public function modifyQuery(Builder $query);
}
