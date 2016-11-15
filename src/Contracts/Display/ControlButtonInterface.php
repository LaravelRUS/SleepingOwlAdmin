<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;

interface ControlButtonInterface extends Renderable, Arrayable
{
    /**
     * @return int
     */
    public function getPosition();

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model);

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
