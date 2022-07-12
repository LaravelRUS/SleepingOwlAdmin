<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\Initializable;

interface DisplayInterface extends Arrayable, Renderable, Initializable
{
    /**
     * Set display class.
     *
     * @param  string  $class
     */
    public function setModelClass(string $class);

    /**
     * @return string|View
     */
    public function getView(): string|View;
}
