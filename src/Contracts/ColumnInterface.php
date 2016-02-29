<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;

interface ColumnInterface extends Initializable
{
    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model);
}
