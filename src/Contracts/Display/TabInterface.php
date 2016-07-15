<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
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
     * @return DisplayInterface|FormInterface
     */
    public function getContent();
}
