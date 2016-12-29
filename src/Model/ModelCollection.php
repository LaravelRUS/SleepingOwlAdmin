<?php

namespace SleepingOwl\Admin\Model;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class ModelCollection extends Collection
{
    /**
     * @return static
     */
    public function aliases()
    {
        return $this->map(function (ModelConfigurationInterface $model) {
            return $model->getAlias();
        });
    }

    /**
     * @return static
     */
    public function keyByAlias()
    {
        return $this->keyBy(function (ModelConfigurationInterface $model) {
            return $model->getAlias();
        });
    }
}
