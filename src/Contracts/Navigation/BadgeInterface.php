<?php

namespace SleepingOwl\Admin\Contracts\Navigation;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface BadgeInterface extends Renderable, Arrayable
{
    /**
     * @return string
     */
    public function getValue();
}
