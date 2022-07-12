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
    public function getLabel(): string;

    /**
     * @return bool
     */
    public function isActive(): bool;

    /**
     * @return string
     */
    public function getName(): string;

    /**
     * @return string|null
     */
    public function getIcon(): ?string;

    /**
     * @return Renderable
     */
    public function getContent(): Renderable;
}
