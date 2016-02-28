<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface TableHeaderColumnInterface extends Renderable, Arrayable
{
    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return bool
     */
    public function isOrderable();
}
