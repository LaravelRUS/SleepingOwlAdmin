<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

interface ColumnInterface extends Initializable, Renderable, Arrayable
{
    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model);

    /**
     * @return int
     */
    public function getWidth();

    /**
     * @return TableHeaderColumnInterface
     */
    public function getHeader();
}
