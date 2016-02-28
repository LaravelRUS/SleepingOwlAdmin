<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Model\ModelConfiguration;

interface FormButtonsInterface extends Renderable, Arrayable
{
    /**
     * @param ModelConfiguration $modelConfiguration
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfiguration $modelConfiguration);
}
