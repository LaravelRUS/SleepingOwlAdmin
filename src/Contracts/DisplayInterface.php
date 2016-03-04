<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface DisplayInterface extends Arrayable, Renderable, Initializable
{
    /**
     * Set display class.
     *
     * @param string $class
     */
    public function setModelClass($class);

    /**
     * @return string
     */
    public function getView();
}
