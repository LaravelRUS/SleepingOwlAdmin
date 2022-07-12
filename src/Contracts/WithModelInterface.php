<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;

interface WithModelInterface
{
    /**
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model): self;

    /**
     * @return Model
     */
    public function getModel(): ?Model;
}
