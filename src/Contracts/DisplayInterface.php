<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use SleepingOwl\Admin\Model\ModelConfiguration;

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

    /**
     * @return array
     */
    public function getParams();
}
