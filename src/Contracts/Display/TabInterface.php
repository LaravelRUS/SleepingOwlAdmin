<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;

interface TabInterface extends Arrayable, Renderable, Initializable
{
    /**
     * @return string
     */
    public function getLabel();

    /**
     * @return bool
     */
    public function isActive();

    /**
     * @return string
     */
    public function getName();

    /**
     * @return string
     */
    public function getIcon();

    /**
     * @return Renderable
     */
    public function getContent();
}
