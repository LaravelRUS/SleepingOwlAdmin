<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;

interface DisplayInterface extends Arrayable
{
    /**
     * Initialize display.
     */
    public function initialize();

    /**
     * Set display class.
     *
     * @param string $class
     */
    public function setClass($class);
}
