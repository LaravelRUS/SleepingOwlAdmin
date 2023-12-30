<?php

namespace Admin\Contracts;

use Illuminate\Database\Eloquent\Model;

interface HasFakeModel
{
    /**
     * Sets fake model property.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return \Admin\Contracts\HasFakeModel
     */
    public function setFakeModel(Model $model);

    /**
     * Retrieves fake model property.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getFakeModel();
}
