<?php

namespace SleepingOwl\Admin\Contracts;

interface ActionInterface extends Initializable
{
    /**
     * @return string
     */
    public function getName();
}
