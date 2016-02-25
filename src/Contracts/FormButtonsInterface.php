<?php

namespace SleepingOwl\Admin\Contracts;

use SleepingOwl\Admin\Model\ModelConfiguration;

interface FormButtonsInterface
{
    /**
     * @param ModelConfiguration $modelConfiguration
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfiguration $modelConfiguration);
}
