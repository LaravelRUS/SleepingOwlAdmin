<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface TableHeaderColumnInterface extends Renderable, Arrayable
{
    /**
     * @return string|null
     */
    public function getTitle(): ?string;

    /**
     * @param $title
     * @return $this
     */
    public function setTitle($title): TableHeaderColumnInterface;

    /**
     * @return bool
     */
    public function isOrderable(): bool;
}
