<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\View\View;

interface Placable extends Arrayable
{
    /**
     * @return string|View
     */
    public function getView();

    /**
     * @return null|string
     */
    public function getPlacement(): ?string;
}
