<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Builder;

interface DisplayExtensionInterface extends Arrayable
{
    /**
     * @return int
     */
    public function getOrder(): int;

    /**
     * @param int $order
     * @return $this
     */
    public function setOrder(int $order): self;

    /**
     * @return DisplayInterface
     */
    public function getDisplay(): DisplayInterface;

    /**
     * @param  DisplayInterface  $display
     * @return $this
     */
    public function setDisplay(DisplayInterface $display): self;

    /**
     * @param Builder $query
     */
    public function modifyQuery(Builder $query);
}
