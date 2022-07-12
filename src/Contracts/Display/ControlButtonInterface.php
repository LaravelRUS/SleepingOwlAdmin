<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\WithModelInterface;

interface ControlButtonInterface extends Renderable, Arrayable, WithModelInterface
{
    /**
     * @return int
     */
    public function getPosition(): int;

    /**
     * @param  Model  $model
     * @return mixed
     */
    public function getUrl(Model $model);

    /**
     * @return View|string
     */
    public function getView();

    /**
     * @return string|null
     */
    public function getImage(): ?string;

    /**
     * @return string|null
     */
    public function getText(): ?string;

    /**
     * @return bool
     */
    public function isActive(): bool;
}
