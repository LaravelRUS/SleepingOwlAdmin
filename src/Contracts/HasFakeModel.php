<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;

interface HasFakeModel
{
    /**
     * Sets fake model property.
     *
     * @param  Model  $model
     * @return HasFakeModel
     */
    public function setFakeModel(Model $model): HasFakeModel;

    /**
     * Retrieves fake model property.
     *
     * @return Model
     */
    public function getFakeModel(): Model;
}
