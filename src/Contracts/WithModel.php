<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;

interface WithModel
{
    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model);

    /**
     * @return Model
     */
    public function getModel();
}
