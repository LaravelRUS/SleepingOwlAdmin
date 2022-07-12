<?php

namespace SleepingOwl\Admin\Contracts\Display\Extension;

use SleepingOwl\Admin\Contracts\Initializable;

interface ActionInterface extends Initializable
{
    /**
     * @return string|null
     */
    public function getName(): ?string;
}
