<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use SleepingOwl\Admin\Contracts\DisplayInterface;

interface DisplayExtensionInterface extends Arrayable
{
    /**
     * @return DisplayInterface
     */
    public function getDisplay();

    /**
     * @param DisplayInterface $display
     *
     * @return $this
     */
    public function setDisplay(DisplayInterface $display);

    /**
     * @param \Illuminate\Database\Eloquent\Builder $query
     */
    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query);
}
