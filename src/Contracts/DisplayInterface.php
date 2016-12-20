<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface DisplayInterface extends Arrayable, Renderable, Initializable
{
    /**
     * @return string
     */
    public function getView();

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $model);

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration();
}
