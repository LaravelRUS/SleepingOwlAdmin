<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;

interface Placable extends Arrayable
{
    /**
     * @return string|\Illuminate\View\View
     */
    public function getView();

    /**
     * @return string
     */
    public function getPlacement();
}
