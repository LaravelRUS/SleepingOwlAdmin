<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface ControlButtonInterface extends Renderable, Arrayable, WithModelInterface
{
    /**
     * @return int
     */
    public function getPosition();

    /**
     * @param Model $model
     *
     * @return mixed
     */
    public function getUrl(Model $model);

    /**
     * @return View|string
     */
    public function getView();

    /**
     * @return bool|mixed
     */
    public function isActive();
}
