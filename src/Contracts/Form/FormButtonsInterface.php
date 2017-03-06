<?php

namespace SleepingOwl\Admin\Contracts\Form;

use SleepingOwl\Admin\Contracts\WithModel;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

interface FormButtonsInterface extends Renderable, Arrayable, WithModel
{
    /**
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $modelConfiguration);
}
