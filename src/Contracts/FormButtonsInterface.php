<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface FormButtonsInterface extends Renderable, Arrayable, WithModel
{
    /**
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $modelConfiguration);
}
