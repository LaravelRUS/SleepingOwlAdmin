<?php

namespace SleepingOwl\Admin\Contracts\Display\Extension;

use SleepingOwl\Admin\Contracts\Initializable;

interface ActionInterface extends Initializable
{
    /**
     * @return string
     */
    public function getName();
}
